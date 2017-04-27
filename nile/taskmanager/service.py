from nile.common import log as logging
from nile.common import cfg
from nile.common import exception
from nile.common.i18n import _
from nile.common import utils
from nile.common import wsgi
CONF = cfg.CONF
LOG = logging.getLogger(__name__)

class TaskController(wsgi.Controller):

    """Controller for cluster functionality."""

    # def action(self, req, body, tenant_id, id):
    #     LOG.debug("Committing Action Against Cluster for "
    #               "Tenant '%s'" % tenant_id)
    #     LOG.info(_("req : '%s'\n\n") % req)
    #     LOG.info(_("id : '%s'\n\n") % id)
    #     if not body:
    #         raise exception.BadRequest(_("Invalid request body."))
    #     context = req.environ[wsgi.CONTEXT_KEY]
    #     cluster = models.Cluster.load(context, id)
    #     manager = cluster.datastore_version.manager
    #     api_strategy = strategy.load_api_strategy(manager)
    #     _actions = api_strategy.cluster_controller_actions
    #     selected_action = None
    #     for key in body:
    #         if key in _actions:
    #             selected_action = _actions[key]
    #             break
    #     else:
    #         message = _("No action '%(action)s' supplied "
    #                     "by strategy for manager '%(manager)s'") % (
    #                         {'action': key, 'manager': manager})
    #         raise exception.TroveError(message)
    #     cluster = selected_action(cluster, body)
    #     if cluster:
    #         view = views.load_view(cluster, req=req, load_servers=False)
    #         wsgi_result = wsgi.Result(view.data(), 202)
    #     else:
    #         wsgi_result = wsgi.Result(None, 202)
    #     return wsgi_result

    def show(self, req, tenant_id, id):
        """Return a single cluster."""
        LOG.debug("Showing a Cluster for Tenant '%s'" % tenant_id)
        LOG.info(_("req : '%s'\n\n") % req)
        LOG.info(_("id : '%s'\n\n") % id)
        context = req.environ[wsgi.CONTEXT_KEY]
        LOG.info(_("context : '%s'\n\n") % context)
        LOG.info(_("req.environ : '%s'\n\n") % req.environ)
        return wsgi.Result({"A":12,"B":True,"C":"Connor"}, 200)
    #
    # def delete(self, req, tenant_id, id):
    #     """Delete a cluster."""
    #     LOG.debug("Deleting a Cluster for Tenant '%s'" % tenant_id)
    #     LOG.info(_("req : '%s'\n\n") % req)
    #     LOG.info(_("id : '%s'\n\n") % id)
    #
    #     context = req.environ[wsgi.CONTEXT_KEY]
    #     cluster = models.Cluster.load(context, id)
    #     cluster.delete()
    #     return wsgi.Result(None, 202)
    #
    # def index(self, req, tenant_id):
    #     """Return a list of clusters."""
    #     LOG.debug("Showing a list of clusters for Tenant '%s'" % tenant_id)
    #     LOG.info(_("req : '%s'\n\n") % req)
    #
    #     context = req.environ[wsgi.CONTEXT_KEY]
    #     if not context.is_admin and context.tenant != tenant_id:
    #         raise exception.TroveOperationAuthError(tenant_id=context.tenant)
    #
    #     # load all clusters and instances for the tenant
    #     clusters, marker = models.Cluster.load_all(context, tenant_id, context.zone)
    #     view = views.ClustersView(clusters, req=req)
    #     paged = pagination.SimplePaginatedDataView(req.url, 'clusters', view,
    #                                                marker)
    #     return wsgi.Result(paged.data(), 200)
