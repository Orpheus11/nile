import logging
import logging.handlers
from nile.common import cfg
CONF = cfg.CONF
LOG_FILE = CONF.get('DEFAULT', 'log_dir') + "/" + CONF.get('DEFAULT', 'log_file')
handler = logging.handlers.RotatingFileHandler(LOG_FILE, maxBytes = 1024*1024, backupCount = 5)
fmt = '%(asctime)s %(levelname)s %(name)s [-] %(message)s from (pid=%(process)d) %(funcName)s %(pathname)s:%(lineno)s'

formatter = logging.Formatter(fmt)
handler.setFormatter(formatter)


def getLogger(name):
    logger = logging.getLogger(name)
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)
    return logger



class WritableLogger(object):
    """A thin wrapper that responds to `write` and logs."""

    def __init__(self, logger, level=logging.INFO):
        self.logger = logger
        self.level = level

    def write(self, msg):
        self.logger.log(self.level, msg.rstrip())

def main():
    pass
    # prepare_log('tst.log')

import sys
if __name__ == "__main__":
    sys.exit(main())
