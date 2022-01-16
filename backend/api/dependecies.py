import datetime

from fastapi import Depends
from sqlmodel import Session

from backend import settings
from backend.api.models import Search

db_session: Session = Depends(settings.get_db_session)


def _get_search_model(query: str, page: int, session: Session = db_session):
    search = session.get(Search, (query, page))
    if search is None:
        return Search(
            query=query,
            page=page,
            date=datetime.datetime.now()
            + settings.SEARCH_CACHE_EXPIRATION
            + datetime.timedelta(seconds=1),
        )
    return search


search_model: Search = Depends(_get_search_model)
