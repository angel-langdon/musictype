import pytest
from fastapi.testclient import TestClient

from backend.main import create_app


@pytest.fixture
def base_client() -> TestClient:
    """Fixture for backend app http client."""
    with TestClient(create_app()) as client:
        return client
