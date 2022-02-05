"""
API Routes layer
"""
from fastapi import Response, status
from fastapi.routing import APIRouter

from backend.api.routes import resources

router = APIRouter()

router.include_router(resources.router)


@router.get("/healthcheck")
def healthcheck():
    """Simple healthcheck endpoint for AWS."""
    return Response(status_code=status.HTTP_200_OK)
