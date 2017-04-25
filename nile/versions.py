import os
import routes
from nile.common import wsgi

VERSIONS = {
    "1.0": {
        "id": "v1.0",
        "status": "CURRENT",
        "updated": "2017-04-25T00:00:00Z",
        "links": [],
    },
}


class VersionsController(wsgi.Controller):

    def index(self, request):
        """Respond to a request for API versions."""
        versions = []
        for key, data in VERSIONS.items():
            v = BaseVersion(
                data["id"],
                data["status"],
                request.application_url,
                data["updated"])
            versions.append(v)
        return wsgi.Result(VersionsDataView(versions))

    def show(self, request):
        """Respond to a request for a specific API version."""
        # data = VERSIONS[request.url_version]
        data = VERSIONS['1.0']
        v = Version(data["id"], data["status"],
                    request.application_url, data["updated"])
        return wsgi.Result(VersionDataView(v))


class BaseVersion(object):

    def __init__(self, id, status, base_url, updated):
        self.id = id
        self.status = status
        self.base_url = base_url
        self.updated = updated

    def data(self):
        return {
            "id": self.id,
            "status": self.status,
            "updated": self.updated,
            "links": [{"rel": "self", "href": self.url()}],
        }

    def url(self):
        url = os.path.join(self.base_url, self.id)
        if not url.endswith("/"):
            return url + "/"
        return url


class Version(BaseVersion):

    def url(self):
        if not self.base_url.endswith("/"):
            return self.base_url + "/"
        return self.base_url


class VersionDataView(object):

    def __init__(self, version):
        self.version = version

    def data_for_json(self):
        return {'version': self.version.data()}


class VersionsDataView(object):

    def __init__(self, versions):
        self.versions = versions

    def data_for_json(self):
        return {'versions': [version.data() for version in self.versions]}


class VersionsAPI(wsgi.Router):
    def __init__(self):
        mapper = routes.Mapper()
        versions_resource = VersionsController().create_resource()
        mapper.connect("/", controller=versions_resource, action="index")
        super(VersionsAPI, self).__init__(mapper)


def app_factory(global_conf, **local_conf):
    conf = global_conf.copy()
    conf.update(local_conf)
    return VersionsAPI()
