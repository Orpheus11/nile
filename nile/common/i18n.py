import os
import gettext
import six


CONTEXT_SEPARATOR = "\x04"

def get_locale_dir_variable_name(domain):
    """Build environment variable name for  local dir.

    Convert a translation domain name to a variable for specifying
    a separate locale dir.

    """
    return domain.upper().replace('.', '_').replace('-', '_') + '_LOCALEDIR'



class TranslatorFactory(object):
    "Create translator functions"

    def __init__(self, domain, localedir=None):
        """Establish a set of translation functions for the domain.

        :param domain: Name of translation domain,
                       specifying a message catalog.
        :type domain: str
        :param localedir: Directory with translation catalogs.
        :type localedir: str
        """
        self.domain = domain
        if localedir is None:
            variable_name = get_locale_dir_variable_name(domain)
            localedir = os.environ.get(variable_name)
        self.localedir = localedir

    def _make_translation_func(self, domain=None):
        """Return a translation function ready for use with messages.

        The returned function takes a single value, the unicode string
        to be translated.  The return type varies depending on whether
        lazy translation is being done. When lazy translation is
        enabled, :class:`Message` objects are returned instead of
        regular :class:`unicode` strings.

        The domain argument can be specified to override the default
        from the factory, but the localedir from the factory is always
        used because we assume the log-level translation catalogs are
        installed in the same directory as the main application
        catalog.

        """
        if domain is None:
            domain = self.domain
        t = gettext.translation(domain,
                                localedir=self.localedir,
                                fallback=True)
        # Use the appropriate method of the translation object based
        # on the python version.
        m = t.gettext if six.PY3 else t.ugettext

        def f(msg):
            """oslo_i18n.gettextutils translation function."""
            return m(msg)
        return f

    def _make_contextual_translation_func(self, domain=None):
        """Return a translation function ready for use with context messages.

        The returned function takes two values, the context of
        the unicode string, the unicode string to be translated.
        The returned type is the same as
        :method:`TranslatorFactory._make_translation_func`.

        The domain argument is the same as
        :method:`TranslatorFactory._make_translation_func`.

        """
        if domain is None:
            domain = self.domain
        t = gettext.translation(domain,
                                localedir=self.localedir,
                                fallback=True)
        # Use the appropriate method of the translation object based
        # on the python version.
        m = t.gettext if six.PY3 else t.ugettext

        def f(ctx, msg):
            """oslo.i18n.gettextutils translation with context function."""
            msgctx = "%s%s%s" % (ctx, CONTEXT_SEPARATOR, msg)
            s = m(msgctx)
            if CONTEXT_SEPARATOR in s:
                # Translation not found
                return msg
            return s
        return f

    def _make_plural_translation_func(self, domain=None):
        """Return a plural translation function ready for use with messages.

        The returned function takes three values, the single form of
        the unicode string, the plural form of the unicode string,
        the count of items to be translated.
        The returned type is the same as
        :method:`TranslatorFactory._make_translation_func`.

        The domain argument is the same as
        :method:`TranslatorFactory._make_translation_func`.

        """
        if domain is None:
            domain = self.domain
        t = gettext.translation(domain,
                                localedir=self.localedir,
                                fallback=True)
        # Use the appropriate method of the translation object based
        # on the python version.
        m = t.ngettext if six.PY3 else t.ungettext

        def f(msgsingle, msgplural, msgcount):
            """oslo.i18n.gettextutils plural translation function."""
            return m(msgsingle, msgplural, msgcount)
        return f

    @property
    def primary(self):
        "The default translation function."
        return self._make_translation_func()

    @property
    def contextual_form(self):
        """The contextual translation function.

        The returned function takes two values, the context of
        the unicode string, the unicode string to be translated.

        .. versionadded:: 2.1.0

        """
        return self._make_contextual_translation_func()

    @property
    def plural_form(self):
        """The plural translation function.

        The returned function takes three values, the single form of
        the unicode string, the plural form of the unicode string,
        the count of items to be translated.

        .. versionadded:: 2.1.0

        """
        return self._make_plural_translation_func()

    def _make_log_translation_func(self, level):
        return self._make_translation_func(self.domain + '-log-' + level)

    @property
    def log_info(self):
        "Translate info-level log messages."
        return self._make_log_translation_func('info')

    @property
    def log_warning(self):
        "Translate warning-level log messages."
        return self._make_log_translation_func('warning')

    @property
    def log_error(self):
        "Translate error-level log messages."
        return self._make_log_translation_func('error')

    @property
    def log_critical(self):
        "Translate critical-level log messages."
        return self._make_log_translation_func('critical')



_translators = TranslatorFactory(domain='nile')

# The primary translation function using the well-known name "_"
_ = _translators.primary

# Translators for log levels.
#
# The abbreviated names are meant to reflect the usual use of a short
# name like '_'. The "L" is for "log" and the other letter comes from
# the level.
_LI = _translators.log_info
_LW = _translators.log_warning
_LE = _translators.log_error
_LC = _translators.log_critical

