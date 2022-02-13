from uuid import UUID

from fastapi import HTTPException
from sqlmodel.main import SQLModelMetaclass


def resource_not_found_error(resource: SQLModelMetaclass, resource_id: UUID):
    return HTTPException(
        status_code=404,
        detail=f"{resource.__name__} with id {resource_id!r} not found",
    )
