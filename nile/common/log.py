import logging
from nile.common import cfg
CONF = cfg.CONF
LOG_FILE = CONF.log_dir + "/" + CONF.log_file
fmt = '%(asctime)s %(levelname)s %(name)s [-] %(message)s from (pid=%(process)d) %(funcName)s %(pathname)s:%(lineno)s'
logging.basicConfig(
                level=logging.DEBUG,
                format=fmt,
                filename=LOG_FILE,
                filemode='w')
console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
formatter = logging.Formatter(fmt)
console.setFormatter(formatter)

def getLogger(name):
    logger = logging.getLogger(name)
    logger.addHandler(console)
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
