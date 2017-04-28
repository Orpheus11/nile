from nile.db import models as dbmodels

def persisted_models():
    return {
        'applications': DBapplication,
    }

class DBapplication(dbmodels.DatabaseModelBase):
    _data_fields = []

    def __init__(self, task_status, **kwargs):
        kwargs["task_id"] = task_status.code
        kwargs["deleted"] = False
        super(DBapplication, self).__init__(**kwargs)
        self.task_status = task_status

    def _validate(self, errors):
        pass

    @property
    def task_status(self):
        pass

    @task_status.setter
    def task_status(self, task_status):
        pass
