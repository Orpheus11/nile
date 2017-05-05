from nile.common import log as logging
from nile.common import cfg
from nile.common import exception
from nile.common.i18n import _
from nile.common import utils
from nile.common import pagination
from nile.common import wsgi
from nile.application import models as app_models
from nile.application import views
CONF = cfg.CONF
LOG = logging.getLogger(__name__)

class ApplicationController(wsgi.Controller):

    """Controller for application functionality."""

    def show(self, req, user_id, id):
        """Return a single applications."""
        LOG.debug("Showing a Application for User '%s'" % user_id)
        LOG.info(_("req : '%s'\n\n") % req)
        LOG.info(_("id : '%s'\n\n") % id)
        context = req.environ[wsgi.CONTEXT_KEY]
        LOG.info(_("context : '%s'\n\n") % context.to_dict())
        LOG.info(_("req.environ : '%s'\n\n") % req.environ)
        app = app_models.Application.load(context, id)
        return wsgi.Result(views.load_view(app, req=req).data(), 200)

    def index(self, req, user_id):
        """Return a list of applications."""
        LOG.debug("Showing a list of applications for User '%s'" % user_id)
        LOG.info(_("req : '%s'\n\n") % req)
        context = req.environ[wsgi.CONTEXT_KEY]
        LOG.info(_("context : '%s'\n\n") % context.to_dict())
        if not context.is_admin and context.user_id != user_id:
            raise exception.NileOperationAuthError(user_id=context.user_id)
        applications, page_info = app_models.Application.load_all(context, user_id)
        view = views.ApplicationsView(applications, req=req)
        paged = pagination.SimplePaginatedDataView('applications', view, page_info)
        return wsgi.Result(paged.data(), 200)

    def delete(self, req, user_id, id):
        """Delete an application."""
        LOG.debug("Deleting an Application for User '%s'" % user_id)
        LOG.info(_("req : '%s'\n\n") % req)
        LOG.info(_("id : '%s'\n\n") % id)

        context = req.environ[wsgi.CONTEXT_KEY]
        application = app_models.Application.load(context, id)
        application.delete()
        return wsgi.Result(None, 202)

    def create(self, req, body, user_id):
        LOG.debug("Creating an Application for User '%s'" % user_id)
        LOG.info(_("req : '%s'\n\n") % req)
        LOG.info(_("body : '%s'\n\n") % body)
        context = req.environ[wsgi.CONTEXT_KEY]
        name = body['application']['name']
        app_manager = body['application'].get('app_manager',None)
        LOG.debug("Creating an Application(name: %s, app_manager: %s)" % (name, app_manager))
        application = app_models.Application.create(context, name, app_manager)
        view = views.load_view(application, req=req)
        return wsgi.Result(view.data(), 200)
