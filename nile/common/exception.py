import re
import logging
from nile.common import base_exception as nile_exception
from nile.common.i18n import _

ClientConnectionError = nile_exception.ClientConnectionError
DatabaseMigrationError = nile_exception.DatabaseMigrationError
LOG = logging.getLogger(__name__)
wrap_exception = nile_exception.wrap_exception


def safe_fmt_string(text):
    return re.sub(r'%([0-9]+)', r'\1', text)


class NileError(nile_exception.NileException):
    """Base exception that all custom nile app exceptions inherit from."""
    internal_message = None

    def __init__(self, message=None, **kwargs):
        if message is not None:
            self.message = message
        if self.internal_message is not None:
            try:
                LOG.error(safe_fmt_string(self.internal_message) % kwargs)
            except Exception:
                LOG.error(self.internal_message)
        self.message = safe_fmt_string(self.message)
        super(NileError, self).__init__(**kwargs)


class DBConstraintError(NileError):

    message = _("Failed to save %(model_name)s because: %(error)s.")


class InvalidRPCConnectionReuse(NileError):

    message = _("Invalid RPC Connection Reuse.")


class NotFound(NileError):

    message = _("Resource %(uuid)s cannot be found.")

