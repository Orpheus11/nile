import argparse
import eventlet
from nile.common import cfg

def get_conf_file():
    conf_file = None
    parser = argparse.ArgumentParser()
    parser.add_argument("--conf_file", help="increase output verbosity")
    args = parser.parse_args()
    if args.conf_file:
        conf_file = args.conf_file
    return conf_file

def initialize(conf_file=None):
    eventlet.monkey_patch(all=True, thread=False)
    conf = cfg.CONF
    conf_file = get_conf_file()
    conf(conf_file)
    from nile.db import get_db_api
    database_conf = {"database":{"connection":conf.get("database","connection"),
                                 "connection":conf.get("database","idle_timeout")}}
    get_db_api().configure_db(database_conf)
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

def launch(port,host='0.0.0.0', backlog=128, threads=1000, workers=None):
    from nile.common import service
    from nile.common import base_wsgi
    from nile.common import wsgi
    from nile.common import api
    api_app = api.API()
    app = wsgi.ContextMiddleware(api_app)
    server = base_wsgi.Service(app, port, host=host,
                               backlog=backlog, threads=threads)
    return service.launch(server, workers)


def launch_taskmanager(port,host='0.0.0.0', backlog=128, threads=1000, workers=None):
    from nile.common import service
    from nile.common import base_wsgi
    from nile.common import wsgi
    from nile.taskmanager import api
    task_app = api.API()
    app = wsgi.ContextMiddleware(task_app)
    server = base_wsgi.Service(app, port, host=host,
                               backlog=backlog, threads=threads)
    return service.launch(server, workers)
