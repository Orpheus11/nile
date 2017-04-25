import routes
from nile.common import wsgi
from nile.versions import VersionsController

class API(wsgi.Router):
    """Defines the API routes."""
    def __init__(self):
        mapper = routes.Mapper()
        super(API, self).__init__(mapper)
        self._versions_router(mapper)

    def _versions_router(self, mapper):
        versions_resource = VersionsController().create_resource()
        mapper.connect("/",
                       controller=versions_resource,
                       action="show",
                       conditions={'method': ['GET']})
