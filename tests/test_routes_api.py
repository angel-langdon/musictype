from fastapi import status
from fastapi.testclient import TestClient


def test_healthcheck(base_client: TestClient):
    resp = base_client.get("/api/healthcheck")
    assert resp.status_code == status.HTTP_200_OK
