class ApplicationTask(object):
    """
    Stores the different kind of tasks being performed by a Application.
    """
    _lookup = {}
    def __init__(self, code, name, description):
        self._code = int(code)
        self._name = name
        self._description = description
        ApplicationTask._lookup[self._code] = self
    @property
    def code(self):
        return self._code
    @property
    def name(self):
        return self._name
    @property
    def description(self):
        return self._description

    def __eq__(self, other):
        if not isinstance(other, ApplicationTask):
            return False
        return self._code == other._code
    @classmethod
    def from_code(cls, code):
        if code not in cls._lookup:
            return None
        return cls._lookup[code]
    def __str__(self):
        return "(%d %s %s)" % (self._code, self._name,
                               self._description)
    def __repr__(self):
        return "ApplicationTask.%s (%s)" % (self._name,
                                        self._description)

class ApplicationTasks(object):
    NONE = ApplicationTask(0x01, 'NONE', 'No tasks for the Application.')
    BUILDING_INITIAL = ApplicationTask(
        0x02, 'BUILDING', 'Building the initial Application.')
    DELETING = ApplicationTask(0x03, 'DELETING', 'Deleting the Application.')
    GROWING_Application = ApplicationTask(
        0x05, 'ALTER', 'Altering the Application.')
    BUILDING_ERROR = ApplicationTask(
        0x07, 'BUILDING_ERROR', 'Building the initial Application failed.')
    BUILDING_TIMEOUT = ApplicationTask(
        0x08, 'BUILDING_TIMEOUT', 'Building the initial Application timeout.')
    ACTIVE = ApplicationTask(
        0x09, 'ACTIVE', 'Building the initial Application successed.')
    DELETED = ApplicationTask(
        0x0a, 'DELETED', 'Deleting the Application successed.')
    DELETING_TIMEOUT = ApplicationTask(
        0x0b, 'DELETING_TIMEOUT', 'Deleting the Application timeout.')

# Dissuade further additions at run-time.
ApplicationTask.__init__ = None
