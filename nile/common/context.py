import positional
import uuid


# These arguments will be passed to a new context from the first available
# header to support backwards compatibility.
_ENVIRON_HEADERS = {
    'auth_token': ['HTTP_X_AUTH_TOKEN',
                   'HTTP_X_STORAGE_TOKEN'],
    'user': ['HTTP_X_USER_ID',
             'HTTP_X_USER'],
    'tenant': ['HTTP_X_PROJECT_ID',
               'HTTP_X_TENANT_ID',
               'HTTP_X_TENANT'],
    'user_domain': ['HTTP_X_USER_DOMAIN_ID'],
    'project_domain': ['HTTP_X_PROJECT_DOMAIN_ID'],
    'user_name': ['HTTP_X_USER_NAME'],
    'project_name': ['HTTP_X_PROJECT_NAME',
                     'HTTP_X_TENANT_NAME'],
    'user_domain_name': ['HTTP_X_USER_DOMAIN_NAME'],
    'project_domain_name': ['HTTP_X_PROJECT_DOMAIN_NAME'],
    'request_id': ['openstack.request_id'],


    'service_token': ['HTTP_X_SERVICE_TOKEN'],
    'service_user_id': ['HTTP_X_SERVICE_USER_ID'],
    'service_user_name': ['HTTP_X_SERVICE_USER_NAME'],
    'service_user_domain_id': ['HTTP_X_SERVICE_USER_DOMAIN_ID'],
    'service_user_domain_name': ['HTTP_X_SERVICE_USER_DOMAIN_NAME'],
    'service_project_id': ['HTTP_X_SERVICE_PROJECT_ID'],
    'service_project_name': ['HTTP_X_SERVICE_PROJECT_NAME'],
    'service_project_domain_id': ['HTTP_X_SERVICE_PROJECT_DOMAIN_ID'],
    'service_project_domain_name': ['HTTP_X_SERVICE_PROJECT_DOMAIN_NAME'],
}



def generate_request_id():
    """Generate a unique request id."""
    return 'req-%s' % uuid.uuid4()

class RequestContext(object):

    """Helper class to represent useful information about a request context.

    Stores information about the security context under which the user
    accesses the system, as well as additional request information.
    """

    user_idt_format = u'{user} {tenant} {domain} {user_domain} {p_domain}'

    # @positional(enforcement=positional.WARN)
    def __init__(self,
                 auth_token=None,
                 user=None,
                 tenant=None,
                 domain=None,
                 user_domain=None,
                 project_domain=None,
                 is_admin=False,
                 read_only=False,
                 show_deleted=False,
                 request_id=None,
                 resource_uuid=None,
                 overwrite=True,
                 roles=None,
                 user_name=None,
                 project_name=None,
                 domain_name=None,
                 user_domain_name=None,
                 project_domain_name=None,
                 is_admin_project=True,
                 service_token=None,
                 service_user_id=None,
                 service_user_name=None,
                 service_user_domain_id=None,
                 service_user_domain_name=None,
                 service_project_id=None,
                 service_project_name=None,
                 service_project_domain_id=None,
                 service_project_domain_name=None,
                 service_roles=None):
        """Initialize the RequestContext

        :param overwrite: Set to False to ensure that the greenthread local
                          copy of the index is not overwritten.
        :param is_admin_project: Whether the specified project is specified in
                                 the token as the admin project. Defaults to
                                 True for backwards compatibility.
        :type is_admin_project: bool
        """
        # setting to private variables to avoid triggering subclass properties
        self.user_id = user
        self.project_id = tenant
        self.domain_id = domain
        self.user_domain_id = user_domain
        self.project_domain_id = project_domain
        self.auth_token = auth_token
        self.user_name = user_name
        self.project_name = project_name
        self.domain_name = domain_name
        self.user_domain_name = user_domain_name
        self.project_domain_name = project_domain_name
        self.is_admin = is_admin
        self.is_admin_project = is_admin_project
        self.read_only = read_only
        self.show_deleted = show_deleted
        self.resource_uuid = resource_uuid
        self.roles = roles or []

        self.service_token = service_token
        self.service_user_id = service_user_id
        self.service_user_name = service_user_name
        self.service_user_domain_id = service_user_domain_id
        self.service_user_domain_name = service_user_domain_name
        self.service_project_id = service_project_id
        self.service_project_name = service_project_name
        self.service_project_domain_id = service_project_domain_id
        self.service_project_domain_name = service_project_domain_name
        self.service_roles = service_roles or []

        if not request_id:
            request_id = generate_request_id()
        self.request_id = request_id

    def to_dict(self):
        """Return a dictionary of context attributes."""
        user_idt = self.user_idt_format.format(
            user=self.user_id or '-',
            tenant=self.project_id or '-',
            domain=self.domain_id or '-',
            user_domain=self.user_domain_id or '-',
            p_domain=self.project_domain_id or '-')

        return {'user': self.user_id,
                'tenant': self.project_id,
                'domain': self.domain_id,
                'user_domain': self.user_domain_id,
                'project_domain': self.project_domain_id,
                'is_admin': self.is_admin,
                'read_only': self.read_only,
                'show_deleted': self.show_deleted,
                'auth_token': self.auth_token,
                'request_id': self.request_id,
                'resource_uuid': self.resource_uuid,
                'roles': self.roles,
                'user_identity': user_idt,
                'is_admin_project': self.is_admin_project}

    def get_logging_values(self):
        """Return a dictionary of logging specific context attributes."""
        values = {'user_name': self.user_name,
                  'project_name': self.project_name,
                  'domain_name': self.domain_name,
                  'user_domain_name': self.user_domain_name,
                  'project_domain_name': self.project_domain_name}
        values.update(self.to_dict())
        return values

    @classmethod
    def from_dict(cls, values, **kwargs):
        """Construct a context object from a provided dictionary."""
        kwargs.setdefault('auth_token', values.get('auth_token'))
        kwargs.setdefault('user', values.get('user'))
        kwargs.setdefault('tenant', values.get('tenant'))
        kwargs.setdefault('domain', values.get('domain'))
        kwargs.setdefault('user_domain', values.get('user_domain'))
        kwargs.setdefault('project_domain', values.get('project_domain'))
        kwargs.setdefault('is_admin', values.get('is_admin', False))
        kwargs.setdefault('read_only', values.get('read_only', False))
        kwargs.setdefault('show_deleted', values.get('show_deleted', False))
        kwargs.setdefault('request_id', values.get('request_id'))
        kwargs.setdefault('resource_uuid', values.get('resource_uuid'))
        kwargs.setdefault('roles', values.get('roles'))
        kwargs.setdefault('user_name', values.get('user_name'))
        kwargs.setdefault('project_name', values.get('project_name'))
        kwargs.setdefault('domain_name', values.get('domain_name'))
        kwargs.setdefault('user_domain_name', values.get('user_domain_name'))
        kwargs.setdefault('project_domain_name',
                          values.get('project_domain_name'))
        kwargs.setdefault('is_admin_project',
                          values.get('is_admin_project', True))
        return cls(**kwargs)

    @classmethod
    def from_environ(cls, environ, **kwargs):
        """Load a context object from a request environment.

        If keyword arguments are provided then they override the values in the
        request environment.

        :param environ: The environment dictionary associated with a request.
        :type environ: dict
        """
        # Load a new context object from the environment variables set by
        # auth_token middleware. See:
        # http://docs.openstack.org/developer/keystonemiddleware/api/keystonemiddleware.auth_token.html#what-auth-token-adds-to-the-request-for-use-by-the-openstack-service

        # add kwarg if not specified by user from a list of possible headers
        for k, v_list in _ENVIRON_HEADERS.items():
            if k in kwargs:
                continue

            for v in v_list:
                if v in environ:
                    kwargs[k] = environ[v]
                    break

        if 'roles' not in kwargs:
            roles = environ.get('HTTP_X_ROLES', environ.get('HTTP_X_ROLE'))
            roles = [r.strip() for r in roles.split(',')] if roles else []
            kwargs['roles'] = roles

        if 'service_roles' not in kwargs:
            roles = environ.get('HTTP_X_SERVICE_ROLES')
            roles = [r.strip() for r in roles.split(',')] if roles else []
            kwargs['service_roles'] = roles

        if 'is_admin_project' not in kwargs:
            # NOTE(jamielennox): we default is_admin_project to true because if
            # nothing is provided we have to assume it is the admin project to
            # make old policy continue to work.
            is_admin_proj_str = environ.get('HTTP_X_IS_ADMIN_PROJECT', 'true')
            kwargs['is_admin_project'] = is_admin_proj_str.lower() == 'true'

        return cls(**kwargs)

class NileContext(RequestContext):
    """
    Stores information about the security context under which the user
    accesses the system, as well as additional request information.
    """
    def __init__(self, **kwargs):
        self.limit = kwargs.pop('limit', None)
        self.marker = kwargs.pop('marker', None)
        self.auto = kwargs.pop('auto', None)
        self.service_catalog = kwargs.pop('service_catalog', None)
        self.user_identity = kwargs.pop('user_identity', None)
        self.user_name = kwargs.pop('user_name', None)
        self.zone = kwargs.pop('zone', None)
        # TODO(esp): not sure we need this
        self.timeout = kwargs.pop('timeout', None)
        super(NileContext, self).__init__(**kwargs)

    def to_dict(self):
        parent_dict = super(NileContext, self).to_dict()
        parent_dict.update({'limit': self.limit,
                            'marker': self.marker,
                            'service_catalog': self.service_catalog
                            })
        return parent_dict

    @classmethod
    def from_dict(cls, values):
        return cls(**values)
