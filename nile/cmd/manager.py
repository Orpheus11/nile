from nile.common import service as nile_service
from nile.cmd.common import with_initialize
from nile.cmd.http_service import create_thread

def startup(conf, topic):
    server = rpc_service.RpcService(
        manager=conf.taskmanager_manager, topic=topic,
        rpc_api_version=rpc_version.RPC_API_VERSION)
    launcher = nile_service.launch(conf, server)
    create_thread(conf.bind_host,conf.bind_port)
    launcher.wait()

@with_initialize
def main(conf):
    startup(conf, conf.taskmanager_queue)
