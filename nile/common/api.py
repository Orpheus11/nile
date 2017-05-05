import routes
from nile.common import wsgi
from nile.versions import VersionsController
from nile.application.service import ApplicationController

class API(wsgi.Router):
    """Defines the API routes."""
    def __init__(self):
        mapper = routes.Mapper()
        super(API, self).__init__(mapper)
        self._versions_router(mapper)
        self._applications_router(mapper)

    def _versions_router(self, mapper):
        versions_resource = VersionsController().create_resource()
        mapper.connect("/",
                       controller=versions_resource,
                       action="show",
                       conditions={'method': ['GET']})

    def _applications_router(self, mapper):
        applications_resource = ApplicationController().create_resource()
        mapper.connect("/{user_id}/applications",
                       controller=applications_resource,
                       action="index",
                       conditions={'method': ['GET']})
        mapper.connect("/{user_id}/applications/{id}",
                       controller=applications_resource,
                       action="show",
                       conditions={'method': ['GET']})
        mapper.connect("/{user_id}/applications",
                       controller=applications_resource,
                       action="create",
                       conditions={'method': ['POST']})
        mapper.connect("/{user_id}/applications/{id}",
                       controller=applications_resource,
                       action="delete",
                       conditions={'method': ['DELETE']})
