from fastapi import Depends
from sqlmodel import Session

from backend import settings

db_session: Session = Depends(settings.get_db_session)
