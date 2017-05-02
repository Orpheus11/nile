from nile.cmd.common import launch, get_worker_count, with_initialize


@with_initialize
def main(CONF):
    workers = int(CONF.workers) or get_worker_count()
    launcher = launch(CONF.bind_port, host=CONF.bind_host, workers=workers)
    launcher.wait()

import sys
if __name__ == "__main__":
    sys.exit(main())

#python site-packages/nile/cmd/api.py --conf_file=/etc/nile/nile.conf