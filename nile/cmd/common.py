def initialize(conf_file=None):
    import eventlet
    eventlet.monkey_patch(all=True, thread=False)
    from nile.common import cfg
    conf = cfg.CONF
    if conf_file:
        conf(conf_file)
    # from nile.db import get_db_api
    # get_db_api().configure_db(conf)
    return conf

def with_initialize(main_function=None, **kwargs):
    def apply(main_function):
        def run():
            conf = initialize(**kwargs)
            return main_function(conf)
        return run
    if main_function:
        return apply(main_function)
    else:
        return apply


from nile.common import service
from nile.common import api
from nile.common import base_wsgi
def launch(app_name, port,
           host='0.0.0.0', backlog=128, threads=1000, workers=None):

    print("nile started on %s", host)
    app = api.API()
    server = base_wsgi.Service(app, port, host=host,
                               backlog=backlog, threads=threads)
    return service.launch(server, workers)

def get_worker_count():
    """Utility to get the default worker count.

    @return: The number of CPUs if that can be determined, else a default
             worker count of 1 is returned.
    """
    try:
        import multiprocessing
        return multiprocessing.cpu_count()
    except NotImplementedError:
        return 1
