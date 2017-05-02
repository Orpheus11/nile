import nile.common.log as logging
from nile.common import cfg
from nile.common.utils import import_class

CONF = cfg.CONF
LOG = logging.getLogger(__name__)


def load_api_strategy(manager):
    clazz = CONF.get(manager, 'api_strategy')
    LOG.debug("Loading class %s" % clazz)
    api_strategy = import_class(clazz)
    return api_strategy()
