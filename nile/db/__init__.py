import optparse

from nile.common import cfg
from nile.common import utils

CONF = cfg.CONF

db_api_opt = CONF.get('DEFAULT', 'db_api_implementation')


def get_db_api():
    return utils.import_module(db_api_opt)


class Query(object):
    def __init__(self, model, query_func, **conditions):
        self._query_func = query_func
        self._model = model
        self._conditions = conditions
        self.db_api = get_db_api()

    def all(self):
        return self.db_api.list(self._query_func, self._model,
                                **self._conditions)

    def count(self):
        return self.db_api.count(self._query_func, self._model,
                                 **self._conditions)

    def first(self):
        return self.db_api.first(self._query_func, self._model,
                                 **self._conditions)

    def join(self, *args):
        return self.db_api.join(self._query_func, self._model, *args)

    def __iter__(self):
        return iter(self.all())

    def update(self, **values):
        self.db_api.update_all(self._query_func, self._model, self._conditions,
                               values)

    def delete(self):
        self.db_api.delete_all(self._query_func, self._model,
                               **self._conditions)

    def limit(self, limit=200, marker=None, marker_column=None):
        return self.db_api.find_all_by_limit(
            self._query_func,
            self._model,
            self._conditions,
            limit=limit,
            marker=marker,
            marker_column=marker_column)

    # def paginated_collection(self, limit=200, marker=None, marker_column=None):
    #     collection = self.limit(int(limit) + 1, marker, marker_column)
    #     if len(collection) > int(limit):
    #         return (collection[0:-1], collection[-2]['id'])
    #     return (collection, None)

    def limit_by_page(self, order_by=None, page_size=200, page_index=0):
        return self.db_api.find_all_by_page(
            self._query_func,
            self._model,
            self._conditions,
            order_by=order_by,
            page_size=page_size,
            page_index=page_index)

    def paginated_collection(self, order_by=None, page_size=200, page_index=0):
        collection = self.limit_by_page(order_by, page_size, page_index)
        return (collection, self.count())


class Queryable(object):

    def __getattr__(self, item):
        return lambda model, **conditions: Query(
            model, query_func=getattr(get_db_api(), item), **conditions)

db_query = Queryable()


def add_options(parser):
    help_text = ("The following configuration options are specific to the "
                 "Nile database.")

    group = optparse.OptionGroup(
        parser,
        "Registry Database Options",
        help_text)
    group.add_option(
        '--sql-connection',
        metavar="CONNECTION",
        default=None,
        help="A valid SQLAlchemy connection string for the "
             "registry database. Default: %(default)s.")
    parser.add_option_group(group)
