import nile.common.log as logging
from nile import strategy

LOG = logging.getLogger(__name__)

class ApplicationView(object):

    def __init__(self, application, req=None):
        self.application = application
        self.req = req

    def data(self):
        application_dict = {
            "id": self.application.id,
            "name": self.application.name,
            "task": {"id": self.application.task_id,
                     "name": self.application.task_name,
                     "description": self.application.task_description},
            "status": self.application.task_name,
            "created": self.application.created,
            "updated": self.application.updated
        }
        LOG.debug(application_dict)
        return {"application": application_dict}

class ApplicationsView(object):
    def __init__(self, applications, req=None):
        self.applications = applications
        self.req = req

    def data(self):
        data = []
        for application in self.applications:
            data.append(self.data_for_application(application))
        return {'Applications': data}

    def data_for_application(self, application):
        view = load_view(application, req=self.req)
        return view.data()['Application']

def load_view(application, req):
    manager = "fabric"
    return strategy.load_api_strategy(manager).Application_view_class(
        application, req)
