import nile.common.log as logging
from nile.application import models
from nile.application.views import ApplicationView
from nile.application.tasks import ApplicationTasks
# from nile.taskmanager import api as task_api
from nile.common import const
from nile.common import cfg
LOG = logging.getLogger(__name__)
CONF = cfg.CONF


class FABRICAPIStrategy(object):
    @property
    def application_class(self):
        return FABRICApplication

    @property
    def application_controller_actions(self):
        return {
            'test_application': self.test_application
        }

    @property
    def application_view_class(self):
        return FABRICApplicationView

    def test_application(self, application, body):
        return application.test_application()

class FABRICApplication(models.Application):
    @classmethod
    def create(cls, context, name):
        LOG.debug("Initiating FABRIC Application creation.")
        db_info = models.DBApplication.create(task_status=ApplicationTasks.BUILDING_INITIAL,
            name=name, user_id=context.user_id, app_manager=const.APP_MANAGER_FABRIC)
        return FABRICApplication(context, db_info)

    def test_application(self):
        pass

class FABRICApplicationView(ApplicationView):
    pass

