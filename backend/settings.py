import os
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

load_dotenv()

BASE_DIR = Path(__file__).parent
_DEFAULT_SQLITE = BASE_DIR.parent / "dev_database.db"
_DB_SQLITE_URI = f"sqlite:///{_DEFAULT_SQLITE.as_posix()}"
DB_URI = os.environ.get("DB_URI", _DB_SQLITE_URI)
DB_IS_SQLITE = urlparse(DB_URI).scheme == "sqlite"

APP_ENV: str = os.environ["APP_ENV"]
assert APP_ENV in {"dev", "prod"}


def _create_db_engine(**kwargs: Any):
    if DB_IS_SQLITE:
        kwargs["connect_args"] = {"check_same_thread": False}

    return create_engine(DB_URI, **kwargs, echo=False)


engine = _create_db_engine()


def init_db():
    """Setup DB metadata."""
    SQLModel.metadata.create_all(engine)


def get_db_session() -> Session:
    """Return a db Session."""
    with Session(engine) as session:
        return session
