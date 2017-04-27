import re
import traceback
import uuid
import eventlet.wsgi
import jsonschema
from nile.common import log as logging
from nile.common import jsonutils
import webob
import webob.dec
import webob.exc
from nile.common import base_wsgi
from nile.common import exception
from nile.common.i18n import _
from nile.common import utils

CONTEXT_KEY = 'nile.context'
Router = base_wsgi.Router
JSONDictSerializer = base_wsgi.JSONDictSerializer
RequestDeserializer = base_wsgi.RequestDeserializer
eventlet.wsgi.MAX_HEADER_LINE = 16384
eventlet.patcher.monkey_patch(all=False, socket=True)
LOG = logging.getLogger('nile.common.wsgi')


# def launch(app_name, port,
#            host='0.0.0.0', backlog=128, threads=1000, workers=None):
#
#     LOG.debug("nile started on %s", host)
#     app = api.API()
#     server = base_wsgi.Service(app, port, host=host,
#                                backlog=backlog, threads=threads)
#     return service.launch(CONF, server, workers)


# Note: taken
def serializers(**serializers):
    """Attaches serializers to a method.

    This decorator associates a dictionary of serializers with a
    method.  Note that the function attributes are directly
    manipulated; the method is not wrapped.
    """

    def decorator(func):
        if not hasattr(func, 'wsgi_serializers'):
            func.wsgi_serializers = {}
        func.wsgi_serializers.update(serializers)
        return func

    return decorator

class ContextMiddleware(base_wsgi.Middleware):
    def __init__(self, application):
        # self.admin_roles = CONF.admin_roles
        self.admin_roles = "admin"
        super(ContextMiddleware, self).__init__(application)

    def _extract_limits(self, params):
        return {key: params[key] for key in params.keys()
                if key in ["auto", "limit", "marker"]}

    def process_request(self, request):
        service_catalog = None
        catalog_header = request.headers.get('X-Service-Catalog', None)
        if catalog_header:
            try:
                service_catalog = jsonutils.loads(catalog_header)
            except ValueError:
                raise webob.exc.HTTPInternalServerError(
                    _('Invalid service catalog json.'))
        tenant_id = request.headers.get('X-Tenant-Id', None)
        auth_token = request.headers.get("X-Auth-Token", None)
        user_id = request.headers.get('X-User-ID', None)
        user_name = request.headers.get("X-Tenant-Name",None)
        roles = request.headers.get('X-Role', '').split(',')
        zone = request.headers.get('X-Zone', None)
        is_admin = False
        for role in roles:
            if role.lower() in self.admin_roles:
                is_admin = True
                break
        limits = self._extract_limits(request.params)
        from nile.common import context as rd_context
        context = rd_context.NileContext(auth_token=auth_token,
                                          tenant=tenant_id,
                                          user=user_id,
                                          user_name=user_name,
                                          zone=zone,
                                          is_admin=is_admin,
                                          auto=limits.get('auto'),
                                          limit=limits.get('limit'),
                                          marker=limits.get('marker'),
                                          service_catalog=service_catalog)
        request.environ[CONTEXT_KEY] = context

class Router(base_wsgi.Router):
    # Original router did not allow for serialization of the 404 error.
    # To fix this the _dispatch was modified to use Fault() objects.
    @staticmethod
    @webob.dec.wsgify
    def _dispatch(req):
        """
        Called by self._router after matching the incoming request to a route
        and putting the information into req.environ.  Either returns 404
        or the routed WSGI app's response.
        """

        match = req.environ['wsgiorg.routing_args'][1]
        if not match:
            return Fault(webob.exc.HTTPNotFound())
        app = match['controller']
        return app


class Request(base_wsgi.Request):
    @property
    def params(self):
        return utils.stringify_keys(super(Request, self).params)

    def best_match_content_type(self, supported_content_types=None):
        """Determine the most acceptable content-type.

        Based on the query extension then the Accept header.

        """
        parts = self.path.rsplit('.', 1)

        if len(parts) > 1:
            format = parts[1]
            if format in ['json']:
                return 'application/{0}'.format(parts[1])

        ctypes = {
            'application/nile+json': "application/json",
            'application/json': "application/json",
        }
        bm = self.accept.best_match(ctypes.keys())

        return ctypes.get(bm, 'application/json')

    @utils.cached_property
    def url_version(self):
        versioned_url_re = re.compile("/v(?P<version_no>\d+\.?\d*)")
        match = versioned_url_re.search(self.path)
        return match.group("version_no") if match else None


class Result(object):
    """A result whose serialization is compatible with JSON."""

    def __init__(self, data, status=200):
        self._data = data
        self.status = status

    def data(self, serialization_type):
        """Return an appropriate serialized type for the body.
           serialization_type is not used presently, but may be
           in the future, so it stays.
        """

        if hasattr(self._data, "data_for_json"):
            return self._data.data_for_json()
        return self._data


class Resource(base_wsgi.Resource):
    def __init__(self, controller, deserializer, serializer,
                 exception_map=None):
        exception_map = exception_map or {}
        self.model_exception_map = self._invert_dict_list(exception_map)
        super(Resource, self).__init__(controller, deserializer, serializer)

    @webob.dec.wsgify(RequestClass=Request)
    def __call__(self, request):
        return super(Resource, self).__call__(request)

    def execute_action(self, action, request, **action_args):
        if getattr(self.controller, action, None) is None:
            return Fault(webob.exc.HTTPNotFound())
        try:
            self.controller.validate_request(action, action_args)
            result = super(Resource, self).execute_action(
                action,
                request,
                **action_args)
            if type(result) is dict:
                result = Result(result)
            return result

        except exception.NileError as nile_error:
            LOG.debug(traceback.format_exc())
            LOG.debug("Caught Nile Error %s", nile_error)
            httpError = self._get_http_error(nile_error)
            LOG.debug("Mapped Error to %s", httpError)
            return Fault(httpError(str(nile_error), request=request))
        except webob.exc.HTTPError as http_error:
            LOG.debug(traceback.format_exc())
            return Fault(http_error)
        except Exception as error:
            exception_uuid = str(uuid.uuid4())
            LOG.exception(exception_uuid + ": " + str(error))
            return Fault(webob.exc.HTTPInternalServerError(
                "Internal Server Error. Please keep this ID to help us "
                "figure out what went wrong: (%s)." % exception_uuid,
                request=request))

    def _get_http_error(self, error):
        return self.model_exception_map.get(type(error),
                                            webob.exc.HTTPBadRequest)

    def _invert_dict_list(self, exception_dict):
        """Flattens values of keys and inverts keys and values.

        Example:
        {'x': [1, 2, 3], 'y': [4, 5, 6]} converted to
        {1: 'x', 2: 'x', 3: 'x', 4: 'y', 5: 'y', 6: 'y'}

        """
        inverted_dict = {}
        for key, value_list in exception_dict.items():
            for value in value_list:
                inverted_dict[value] = key
        return inverted_dict

    def serialize_response(self, action, action_result, accept):
        # If an exception is raised here in the base class, it is swallowed,
        # and the action_result is returned as-is. For us, that's bad news -
        # we never want that to happen except in the case of webob types.
        # So we override the behavior here so we can at least log it.
        try:
            return super(Resource, self).serialize_response(
                action, action_result, accept)
        except Exception:
            # execute_action either returns the results or a Fault object.
            # If action_result is not a Fault then there really was a
            # serialization error which we log. Otherwise return the Fault.
            if not isinstance(action_result, Fault):
                LOG.exception(_("Unserializable result detected."))
                raise
            return action_result


class Controller(object):
    """Base controller that creates a Resource with default serializers."""

    exception_map = {
        webob.exc.HTTPNotFound: [
            exception.NotFound,
        ],
    }

    schemas = {}

    @classmethod
    def get_schema(cls, action, body):
        LOG.debug("Getting schema for %s:%s" %
                  (cls.__class__.__name__, action))
        if cls.schemas:
            matching_schema = cls.schemas.get(action, {})
            if matching_schema:
                LOG.debug(
                    "Found Schema: %s" % matching_schema.get("name",
                                                             matching_schema))
            return matching_schema

    @staticmethod
    def format_validation_msg(errors):
        # format path like object['field1'][i]['subfield2']
        messages = []
        for error in errors:
            path = list(error.path)
            f_path = "%s%s" % (path[0],
                               ''.join(['[%r]' % i for i in path[1:]]))
            messages.append("%s %s" % (f_path, error.message))
            for suberror in sorted(error.context, key=lambda e: e.schema_path):
                messages.append(suberror.message)
        error_msg = "; ".join(messages)
        return "Validation error: %s" % error_msg

    def validate_request(self, action, action_args):
        body = action_args.get('body', {})
        schema = self.get_schema(action, body)
        if schema:
            validator = jsonschema.Draft4Validator(schema)
            if not validator.is_valid(body):
                errors = sorted(validator.iter_errors(body),
                                key=lambda e: e.path)
                error_msg = self.format_validation_msg(errors)
                LOG.info(error_msg)
                raise exception.BadRequest(message=error_msg)

    def create_resource(self):
        return Resource(
            self,
            RequestDeserializer(),
            NileResponseSerializer(),
            self.exception_map)

    def _extract_limits(self, params):
        return {key: params[key] for key in params.keys()
                if key in ["limit", "marker"]}


class NileResponseSerializer(base_wsgi.ResponseSerializer):
    def serialize_body(self, response, data, content_type, action):
        """Overrides body serialization in base_wsgi.ResponseSerializer.

        If the "data" argument is the Result class, its data
        method is called and *that* is passed to the superclass implementation
        instead of the actual data.

        """
        if isinstance(data, Result):
            data = data.data(content_type)
        super(NileResponseSerializer, self).serialize_body(
            response,
            data,
            content_type,
            action)

    def serialize_headers(self, response, data, action):
        super(NileResponseSerializer, self).serialize_headers(
            response,
            data,
            action)
        if isinstance(data, Result):
            response.status = data.status


class Fault(webob.exc.HTTPException):
    """Error codes for API faults."""

    code_wrapper = {
        400: webob.exc.HTTPBadRequest,
        401: webob.exc.HTTPUnauthorized,
        403: webob.exc.HTTPUnauthorized,
        404: webob.exc.HTTPNotFound,
    }

    resp_codes = [int(code) for code in code_wrapper.keys()]

    def __init__(self, exception):
        """Create a Fault for the given webob.exc.exception."""

        self.wrapped_exc = exception

    @staticmethod
    def _get_error_name(exc):
        # Displays a Red Dwarf specific error name instead of a webob exc name.
        named_exceptions = {
            'HTTPBadRequest': 'badRequest',
            'HTTPUnauthorized': 'unauthorized',
            'HTTPForbidden': 'forbidden',
            'HTTPNotFound': 'itemNotFound',
            'HTTPMethodNotAllowed': 'badMethod',
            'HTTPRequestEntityTooLarge': 'overLimit',
            'HTTPUnsupportedMediaType': 'badMediaType',
            'HTTPInternalServerError': 'instanceFault',
            'HTTPNotImplemented': 'notImplemented',
            'HTTPServiceUnavailable': 'serviceUnavailable',
        }
        name = exc.__class__.__name__
        if name in named_exceptions:
            return named_exceptions[name]

        # If the exception isn't in our list, at least strip off the
        # HTTP from the name, and then drop the case on the first letter.
        name = name.split("HTTP").pop()
        name = name[:1].lower() + name[1:]
        return name

    @webob.dec.wsgify(RequestClass=Request)
    def __call__(self, req):
        """Generate a WSGI response based on the exception passed to ctor."""

        # Replace the body with fault details.
        fault_name = Fault._get_error_name(self.wrapped_exc)
        fault_data = {
            fault_name: {
                'code': self.wrapped_exc.status_int,
            }
        }
        if self.wrapped_exc.detail:
            fault_data[fault_name]['message'] = self.wrapped_exc.detail
        else:
            fault_data[fault_name]['message'] = self.wrapped_exc.explanation

        content_type = req.best_match_content_type()
        serializer = {
            'application/json': base_wsgi.JSONDictSerializer(),
        }[content_type]

        self.wrapped_exc.body = serializer.serialize(fault_data, content_type)
        self.wrapped_exc.content_type = content_type
        return self.wrapped_exc

class ActionDispatcher(object):
    """Maps method name to local methods through action name."""

    def dispatch(self, *args, **kwargs):
        """Find and call local method."""
        action = kwargs.pop('action', 'default')
        action_method = getattr(self, str(action), self.default)
        return action_method(*args, **kwargs)

    def default(self, data):
        raise NotImplementedError()


class DictSerializer(ActionDispatcher):
    """Default request body serialization."""

    def serialize(self, data, action='default'):
        return self.dispatch(data, action=action)

    def default(self, data):
        return ""


class JSONDictSerializer(DictSerializer):
    """Default JSON request body serialization."""

    def default(self, data):
        return jsonutils.dumps(data)
