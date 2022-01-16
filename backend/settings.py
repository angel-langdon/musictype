import os
from datetime import timedelta
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

load_dotenv()

BASE_DIR = Path(__file__).parent
_DEFAULT_SQLITE = BASE_DIR.parent / "scripts" / "dev_database.db"
_DB_SQLITE_URI = f"sqlite:///{_DEFAULT_SQLITE.as_posix()}"
DB_URI = os.environ.get("DB_URI", _DB_SQLITE_URI)
DB_IS_SQLITE = urlparse(DB_URI).scheme == "sqlite"

APP_SECRET = os.environ["APP_SECRET"]
assert APP_SECRET
APP_ENV: str = os.environ["APP_ENV"]
assert APP_ENV in {"dev", "prod"}


AUTH_SESSION_COOKIE = "session_data"
AUTH_SESSION_EXPIRE = timedelta(days=365)
APP_FRONTEND_BUILD_DIR = (BASE_DIR.parent / "frontend" / "build").as_posix()
SEARCH_CACHE_EXPIRATION = timedelta(days=1)


def _get_db_engine(**kwargs: Any):
    if DB_IS_SQLITE:
        kwargs["echo"] = bool(int(os.environ.get("ECHO_DB", "1")))
        kwargs["connect_args"] = {"check_same_thread": False}

    return create_engine(DB_URI, **kwargs)


def init_db():
    """Setup DB metadata."""
    SQLModel.metadata.create_all(_get_db_engine())


def get_db_session() -> Session:
    """Return a db Session."""
    with Session(_get_db_engine()) as session:
        return session
