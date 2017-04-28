from sqlalchemy import MetaData
from sqlalchemy import orm
from sqlalchemy.orm import exc as orm_exc
from sqlalchemy import Table

def map(engine, models):
    meta = MetaData()
    meta.bind = engine
    if mapping_exists(models['applications']):
        return
    orm.mapper(models['applications'], Table('applications', meta, autoload=True))


def mapping_exists(model):
    try:
        orm.class_mapper(model)
        return True
    except orm_exc.UnmappedClassError:
        return False
