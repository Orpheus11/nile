import threading
import weakref
import contextlib
import logging
import fasteners
import os

LOG = logging.getLogger(__name__)
class Semaphores(object):
    def __init__(self):
        self._semaphores = weakref.WeakValueDictionary()
        self._lock = threading.Lock()

    def get(self, name):
        with self._lock:
            try:
                return self._semaphores[name]
            except KeyError:
                sem = threading.Semaphore()
                self._semaphores[name] = sem
                return sem

    def __len__(self):
        return len(self._semaphores)

_semaphores = Semaphores()
InterProcessLock = fasteners.InterProcessLock
ReaderWriterLock = fasteners.ReaderWriterLock
def internal_lock(name, semaphores=None):
    if semaphores is None:
        semaphores = _semaphores
    return semaphores.get(name)

def external_lock(name, lock_file_prefix=None, lock_path=None):
    lock_file_path = _get_lock_path(name, lock_file_prefix, lock_path)

    return InterProcessLock(lock_file_path)

def _get_lock_path(name, lock_file_prefix, lock_path=None):
    name = name.replace(os.sep, '_')
    if lock_file_prefix:
        sep = '' if lock_file_prefix.endswith('-') else '-'
        name = '%s%s%s' % (lock_file_prefix, sep, name)

    local_lock_path = lock_path

    if not local_lock_path:
        # raise cfg.RequiredOptError('lock_path')
        raise

    return os.path.join(local_lock_path, name)



@contextlib.contextmanager
def lock(name, lock_file_prefix=None, external=False, lock_path=None,
         do_log=True, semaphores=None, delay=0.01):
    """Context based lock

    This function yields a `threading.Semaphore` instance (if we don't use
    eventlet.monkey_patch(), else `semaphore.Semaphore`) unless external is
    True, in which case, it'll yield an InterProcessLock instance.

    :param lock_file_prefix: The lock_file_prefix argument is used to provide
      lock files on disk with a meaningful prefix.

    :param external: The external keyword argument denotes whether this lock
      should work across multiple processes. This means that if two different
      workers both run a method decorated with @synchronized('mylock',
      external=True), only one of them will execute at a time.

    :param lock_path: The path in which to store external lock files.  For
      external locking to work properly, this must be the same for all
      references to the lock.

    :param do_log: Whether to log acquire/release messages.  This is primarily
      intended to reduce log message duplication when `lock` is used from the
      `synchronized` decorator.

    :param semaphores: Container that provides semaphores to use when locking.
        This ensures that threads inside the same application can not collide,
        due to the fact that external process locks are unaware of a processes
        active threads.

    :param delay: Delay between acquisition attempts (in seconds).

    .. versionchanged:: 0.2
       Added *do_log* optional parameter.

    .. versionchanged:: 0.3
       Added *delay* and *semaphores* optional parameters.
    """
    int_lock = internal_lock(name, semaphores=semaphores)
    with int_lock:
        if do_log:
            LOG.debug('Acquired semaphore "%(lock)s"', {'lock': name})
        try:
            if external:
                ext_lock = external_lock(name, lock_file_prefix, lock_path)
                ext_lock.acquire(delay=delay)
                try:
                    yield ext_lock
                finally:
                    ext_lock.release()
            else:
                yield int_lock
        finally:
            if do_log:
                LOG.debug('Releasing semaphore "%(lock)s"', {'lock': name})
