from urllib.parse import urlencode

import pytest
from fastapi.testclient import TestClient

from backend.main import create_app
from backend.settings import AUTH_SESSION_COOKIE

# TODO use testing database instead of the current 'dev_database.db'
ADMIN_EMAIL = "admin@musictype.com"
ADMIN_PASSWORD = "1234"


@pytest.fixture
def base_client() -> TestClient:
    """Fixture for backend app http client."""
    with TestClient(create_app()) as client:
        return client


def api_login(
    client: TestClient,
    email: str = ADMIN_EMAIL,
    password: str = ADMIN_PASSWORD,
    check_ok: bool = True,
):
    """Authenticate test user for TestClient."""
    login_data = {"email": email, "password": password}
    response = client.post(
        "api/auth/login",
        data=urlencode(login_data),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if check_ok:
        assert response.status_code == 200
        token = response.json()["auth_token"]
        token_cookie = response.cookies.get(AUTH_SESSION_COOKIE)
        assert token == token_cookie
    return response


@pytest.fixture
def client(base_client: TestClient) -> TestClient:
    """Fixture for backend app with authenticated http client."""
    # TODO prepopulate test-db
    # api_login(base_client)
    return base_client
