"""
API Routes layer
"""
from fastapi.routing import APIRouter

from backend.api.routes import resources

router = APIRouter()

router.include_router(resources.router)


@router.get("/healthcheck")
def healthcheck():  # pragma: no cover
    """Simple healthcheck endpoint for AWS."""
    return {"ok": True}
