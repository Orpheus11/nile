from nile.cmd.common import launch, get_worker_count,with_initialize
from nile.common import api

@with_initialize
def main(CONF):
    workers = get_worker_count()
    app = api.API()
    launcher = launch(app, CONF.get('DEFAULT', 'bind_port'), host=CONF.get('DEFAULT', 'bind_host'), workers=workers)
    launcher.wait()

import sys
if __name__ == "__main__":
    sys.exit(main())
