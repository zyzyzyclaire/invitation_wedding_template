from sqlalchemy import BIGINT, Column, Integer, BigInteger, String, Text, Date,Boolean, DateTime, ForeignKey, Enum, Index, UniqueConstraint, Float, Numeric, ForeignKeyConstraint
from werkzeug.security import generate_password_hash

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

from config import DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_DB

url = 'mysql://{}:{}@{}:{}/{}'.format(
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_DB
)
  
engine = create_engine(url, echo=False, connect_args={'charset': 'utf8'}, pool_pre_ping=True)
Base = declarative_base()
Session = sessionmaker(bind=engine)


@contextmanager
def session_scope():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()


# increase 넘버 조정
class User(Base):
    __tablename__ = 'user'
    __table_args__ = (UniqueConstraint('hotel_id', 'ota_type', 'name'),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    hotel_id = Column(Integer, ForeignKey('hotel.id'), nullable=False)
    ota_type = Column(Enum(OTAType), nullable=False)
    name = Column(String(128), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    def __init__(self, hotel_id, ota_type, name):
        self.hotel_id = hotel_id
        self.ota_type = ota_type
        self.name = name


Base.metadata.create_all(engine)
