from nile.cmd.common import launch_taskmanager, get_worker_count,with_initialize


@with_initialize
def main(CONF):
    workers = CONF.get('DEFAULT', 'workers') or get_worker_count()
    launcher = launch_taskmanager(CONF.get('DEFAULT', 'bind_port'), host=CONF.get('DEFAULT', 'bind_host'), workers=workers)
    launcher.wait()

import sys
if __name__ == "__main__":
    sys.exit(main())

#python site-packages/nile/cmd/taskmanager.py --conf_file=/etc/nile/nile-taskmanager.conf