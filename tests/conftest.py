import pytest
from fastapi.testclient import TestClient

from backend.main import create_app
from backend.settings import BASE_DIR


@pytest.fixture(scope="session")
def db_for_tests():
    """Session-scoped Setup/Teardown method."""

    path = BASE_DIR.parent / "tests/fixtures/tests_database.db"
    path.parent.mkdir(exist_ok=True)
    yield
    path.unlink()


@pytest.fixture
def base_client(db_for_tests) -> TestClient:
    """Fixture for backend app http client."""
    with TestClient(create_app()) as client:
        return client
