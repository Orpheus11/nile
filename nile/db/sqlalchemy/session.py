import contextlib
from nile.common import log as logging
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy.orm import sessionmaker
from nile.common.i18n import _
from nile.db.sqlalchemy import mappers

_ENGINE = None
_MAKER = None
_ENGINE_PRI = None
_MAKER_PRI = None
LOG = logging.getLogger(__name__)


def configure_db(options, models_mapper=None):
    global _ENGINE
    if not _ENGINE:
        _ENGINE = _create_engine(options)
    if models_mapper:
        models_mapper.map(_ENGINE)
    else:
        from nile.application import models as application_models

        model_modules = [
            application_models,
        ]

        models = {}
        for module in model_modules:
            models.update(module.persisted_models())
        mappers.map(_ENGINE, models)

def configure_db_private(options, models_mapper=None):
    global _ENGINE_PRI
    if not _ENGINE_PRI:
        _ENGINE_PRI = _create_engine_private(options)
        if not _ENGINE_PRI:
            return None
    if models_mapper:
        models_mapper.map(_ENGINE_PRI)
    return _ENGINE_PRI

def _create_engine(options):
    engine_args = {
        "pool_recycle": 3600,
        "echo": False
    }
    LOG.info(_("Creating SQLAlchemy engine with args: %s") % engine_args)
    db_engine = create_engine(options['database']['connection'], **engine_args)
    return db_engine

def _create_engine_private(options):
    url = options['database']['connection_private']
    if len(url) == 0:
        LOG.error(_("Creating SQLAlchemy Private db engine faild with url: %s") % url)
        return None
    engine_args = {
        "pool_recycle": 3600,
        "echo": False
    }
    LOG.info(_("Creating SQLAlchemy private db engine  with args: %s") % engine_args)

    db_engine = create_engine(options['database']['connection_private'], **engine_args)
    return db_engine

def get_session(autocommit=True, expire_on_commit=False):
    """Helper method to grab session."""
    global _MAKER, _ENGINE
    if not _MAKER:
        if not _ENGINE:
            msg = "***The Database has not been setup!!!***"
            LOG.exception(msg)
            raise RuntimeError(msg)
        _MAKER = sessionmaker(bind=_ENGINE,
                              autocommit=autocommit,
                              expire_on_commit=expire_on_commit)
    return _MAKER()

def get_session_private(autocommit=True, expire_on_commit=False):
    """Helper method to grab session."""
    global _MAKER_PRI, _ENGINE_PRI
    if not _MAKER_PRI:
        if not _ENGINE_PRI:
            msg = "***The Private Database has not been setup!!!***"
            LOG.exception(msg)
            raise RuntimeError(msg)
        _MAKER_PRI = sessionmaker(bind=_ENGINE_PRI,
                              autocommit=autocommit,
                              expire_on_commit=expire_on_commit)
    return _MAKER_PRI()

def raw_query(model, autocommit=True, expire_on_commit=False):
    return get_session(autocommit, expire_on_commit).query(model)


def clean_db():
    global _ENGINE
    meta = MetaData()
    meta.reflect(bind=_ENGINE)
    with contextlib.closing(_ENGINE.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            if table.name != "migrate_version":
                con.execute(table.delete())
        trans.commit()


def drop_db(options):
    meta = MetaData()
    engine = _create_engine(options)
    meta.bind = engine
    meta.reflect()
    meta.drop_all()
