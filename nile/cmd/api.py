from nile.cmd.common import launch, get_worker_count
from nile.common import log as logging
LOG = logging.getLogger(__name__)
def main():
    workers = get_worker_count()
    launcher = launch('nile', '8080', host='0.0.0.0', workers=workers)
    launcher.wait()


# def test():
#     LOG.info('api info......')
#     LOG.debug('api debug......')
#     LOG.error('api error......')
#     LOG.exception('api exception......')

import sys
if __name__ == "__main__":
    sys.exit(main())
    # sys.exit(test())
