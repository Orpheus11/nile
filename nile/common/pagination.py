import bisect
import urllib


def url_quote(s):
    if s is None:
        return s
    return urllib.quote(str(s))


def paginate_list(li, limit=None, marker=None, include_marker=False):
    """Sort the given list and return a sublist containing a page of items.

    :param list li:             The list to be paginated.
    :param int limit:           Maximum number of iterms to be returned.
    :param marker:              Key of the first item to appear on the sublist.
    :param bool include_marker: Include the marker value itself in the sublist.
    :return:
    """
    li.sort()
    if include_marker:
        pos = bisect.bisect_left(li, marker)
    else:
        pos = bisect.bisect(li, marker)

    if limit and pos + limit < len(li):
        return li[pos:pos + limit], li[pos + limit]
    else:
        return li[pos:], None

class PaginatedDataView(object):

    def __init__(self, collection_type, collection, page_index=0, page_size=0, total_size=0):
        self.collection_type = collection_type
        self.collection = collection
        self.page_index = int(page_index)
        self.page_size = int(page_size)
        self.total_size = int(total_size)

    def data(self):
        return {self.collection_type: self.collection,
                'page_info': self.page_info,
                }

    def page_info(self):
        page_info = {
            'page_index': self.page_index,
            'page_size': self.page_size,
            'total_size': self.total_size,
        }
        return [page_info]

class SimplePaginatedDataView(object):
    def __init__(self, name, view, page_info):
        self.name = name
        self.view = view
        self.page_info = page_info

    def data(self):
        view_data = {self.name: self.view.data()[self.name],
                     'page_info': self.page_info}
        return view_data
