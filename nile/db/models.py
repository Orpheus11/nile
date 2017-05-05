from nile.common import log as logging
from nile.common import exception
from nile.common.i18n import _
from nile.common import models
from nile.common import pagination
from nile.common import utils
from nile.db import db_query
from nile.db import get_db_api

LOG = logging.getLogger(__name__)


class DatabaseModelBase(models.ModelBase):
    _auto_generated_attrs = ['id']

    @classmethod
    def create(cls, **values):
        now_time = utils.utcnow()
        init_vals = {
            'id': utils.generate_uuid(),
            'created': now_time,
        }
        if hasattr(cls, 'deleted'):
            init_vals['deleted'] = False
        if hasattr(cls, 'updated'):
            init_vals['updated'] = now_time
        init_vals.update(values)
        instance = cls(**init_vals)
        if not instance.is_valid():
            raise exception.InvalidModelError(errors=instance.errors)
        return instance.save()

    @property
    def db_api(self):
        return get_db_api()

    @property
    def preserve_on_delete(self):
        return hasattr(self, 'deleted') and hasattr(self, 'deleted_at')

    @classmethod
    def query(cls):
        return get_db_api()._base_query(cls)

    def save(self):
        if not self.is_valid():
            raise exception.InvalidModelError(errors=self.errors)
        self['updated'] = utils.utcnow()
        LOG.debug("Saving %(name)s: %(dict)s" %
                  {'name': self.__class__.__name__, 'dict': self.__dict__})
        return self.db_api.save(self)

    def delete(self):
        self['updated'] = utils.utcnow()
        LOG.debug("Deleting %(name)s: %(dict)s" %
                  {'name': self.__class__.__name__, 'dict': self.__dict__})

        if self.preserve_on_delete:
            self['deleted_at'] = utils.utcnow()
            self['deleted'] = True
            return self.db_api.save(self)
        else:
            return self.db_api.delete(self)

    def update(self, **values):
        for key in values:
            if hasattr(self, key):
                setattr(self, key, values[key])
        self['updated'] = utils.utcnow()
        return self.db_api.save(self)

    def __init__(self, **kwargs):
        self.merge_attributes(kwargs)
        if not self.is_valid():
            raise exception.InvalidModelError(errors=self.errors)

    def merge_attributes(self, values):
        """dict.update() behaviour."""
        for k, v in values.iteritems():
            self[k] = v

    @classmethod
    def find_by(cls, context=None, **conditions):
        model = cls.get_by(**conditions)

        if model is None:
            raise exception.ModelNotFoundError(_("%(s_name)s Not Found") %
                                               {"s_name": cls.__name__})

        if ((context and not context.is_admin and hasattr(model, 'user_id')
             and model.user_id != context.user_id)):
            msg = _("User %(s_user_id)s tried to access "
                    "%(s_name)s, owned by %(s_owner)s.")
            LOG.error(msg % (
                {"s_user_id": context.user_id, "s_name": cls.__name__,
                 "s_owner": model.user_id}))
            raise exception.ModelNotFoundError(
                _("User %(s_user_id)s cannot access %(s_name)s") % (
                    {"s_user_id": context.user_id, "s_name": cls.__name__}))

        return model

    @classmethod
    def get_by(cls, **kwargs):
        return get_db_api().find_by(cls, **cls._process_conditions(kwargs))

    @classmethod
    def find_all(cls, **kwargs):
        return db_query.find_all(cls, **cls._process_conditions(kwargs))

    @classmethod
    def _process_conditions(cls, raw_conditions):
        """Override in inheritors to format/modify any conditions."""
        return raw_conditions

    @classmethod
    def find_by_pagination(cls, collection_type, collection_query, order_by=None, page_size=200, page_index=0):
        elements, count = collection_query.paginated_collection(order_by=order_by, page_size=page_size, page_index=page_index)
        return pagination.PaginatedDataView(collection_type,
                                            elements,
                                            page_index=page_index,
                                            page_size=page_size,
                                            total_size=count)
