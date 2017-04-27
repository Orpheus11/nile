import routes
from nile.common import wsgi
from nile.versions import VersionsController
from nile.taskmanager.service import TaskController

class API(wsgi.Router):
    """Defines the API routes."""
    def __init__(self):
        mapper = routes.Mapper()
        super(API, self).__init__(mapper)
        self._versions_router(mapper)
        self._clusters_resource_router(mapper)

    def _versions_router(self, mapper):
        versions_resource = VersionsController().create_resource()
        mapper.connect("/",
                       controller=versions_resource,
                       action="show",
                       conditions={'method': ['GET']})

    def _clusters_resource_router(self, mapper):
        clusters_resource = TaskController().create_resource()
        mapper.connect("/{tenant_id}/clusters/{id}",
                       controller=clusters_resource,
                       action="show",
                       conditions={'method': ['GET']})
