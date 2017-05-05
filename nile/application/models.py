from nile.db import models as dbmodels
from nile.common import cfg
from nile.common import exception
from nile.application.tasks import ApplicationTask, ApplicationTasks
from nile import strategy
from nile.common.i18n import _
import nile.common.log as logging
# from nile.common import const
from sqlalchemy import desc
CONF = cfg.CONF
LOG = logging.getLogger(__name__)
def persisted_models():
    return {
        'applications': DBApplication,
    }

class DBApplication(dbmodels.DatabaseModelBase):
    _data_fields = []

    def __init__(self, task_status, **kwargs):
        kwargs["task_id"] = task_status.code
        kwargs["task_name"] = task_status.name
        kwargs["task_desc"] = task_status.description
        kwargs["deleted"] = False
        super(DBApplication, self).__init__(**kwargs)
        self.task_status = task_status

    def _validate(self, errors):
        if ApplicationTask.from_code(self.task_id) is None:
            errors['task_id'] = "Not valid."
        if self.task_status is None:
            errors['task_status'] = "Cannot be None."

    @property
    def task_status(self):
        return ApplicationTask.from_code(self.task_id)

    @task_status.setter
    def task_status(self, task_status):
        self.task_id = task_status.code

class Application(object):
    DEFAULT_LIMIT = int(CONF.apps_page_size)

    def __init__(self, context, db_info):
        self.context = context
        self.db_info = db_info

    @classmethod
    def load_all(cls, context, user_id):
        if not context.is_admin:
            db_infos = DBApplication.find_all(user_id=user_id,
                                          deleted=False)
        else:
            db_infos = DBApplication.find_all(deleted=False)

        page_size = int(context.page_size or Application.DEFAULT_LIMIT)
        if page_size > Application.DEFAULT_LIMIT:
            page_size = Application.DEFAULT_LIMIT
        data_view = DBApplication.find_by_pagination('applications', db_infos, order_by=desc(DBApplication.updated),
                                                 page_index=context.page_index, page_size=page_size)
        page_info = data_view.page_info()
        ret = [cls(context, db_info) for db_info in data_view.collection]
        return ret, page_info

    @classmethod
    def load(cls, context, application_id, clazz=None):
        try:
            db_info = DBApplication.find_by(context=context, id=application_id,
                                        deleted=False)
        except exception.ModelNotFoundError:
            raise exception.ApplicationNotFound(application=application_id)
        if not clazz:
            manager = db_info.app_manager
            clazz = strategy.load_api_strategy(manager).application_class
        return clazz(context, db_info)

    def update_db(self, **values):
        self.db_info = DBApplication.find_by(id=self.id, deleted=False)
        for key in values:
            setattr(self.db_info, key, values[key])
        self.db_info.save()

    def reset_task(self, status=ApplicationTasks.NONE):
        LOG.info(_("Setting task to %s on application %s") % (status.name,self.id))
        self.update_db(task_status=status)

    @property
    def id(self):
        return self.db_info.id

    @property
    def created(self):
        return self.db_info.created

    @property
    def updated(self):
        return self.db_info.updated

    @property
    def name(self):
        return self.db_info.name

    @property
    def task_id(self):
        return self.db_info.task_status.code

    @property
    def task_name(self):
        return self.db_info.task_status.name

    @property
    def task_description(self):
        return self.db_info.task_status.description

    @property
    def user_id(self):
        return self.db_info.user_id

    @property
    def deleted(self):
        return self.db_info.deleted

    @property
    def deleted_at(self):
        return self.db_info.deleted_at

    @classmethod
    def create(cls, context, name, app_manager=None):
        api_strategy = strategy.load_api_strategy(app_manager)
        return api_strategy.application_class.create(context, name)

    def validate_application_available(self, valid_states=[ApplicationTasks.NONE]):
        if self.db_info.task_status not in valid_states:
            msg = (_("This action cannot be performed on the application while "
                     "the current application task is '%s'.") %
                   self.db_info.task_status.name)
            LOG.error(msg)
            raise exception.UnprocessableEntity(msg)

    def delete(self):
        self.validate_application_available([ApplicationTasks.NONE,
                                         ApplicationTasks.ACTIVE,
                                         ApplicationTasks.DELETING,
                                         ApplicationTasks.BUILDING_ERROR,
                                         ApplicationTasks.BUILDING_TIMEOUT,
                                         ApplicationTasks.DELETING_TIMEOUT])
        # self.update_db(task_status=ApplicationTasks.DELETING)
        # task_api.API(self.context).delete_application(self.id)
        self.update_db(deleted=True, task_status=ApplicationTasks.DELETED)
