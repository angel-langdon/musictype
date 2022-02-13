import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import base_router
from backend.settings import APP_ENV, init_db


class HealthCheckFilter(logging.Filter):  # pragma: no cover
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/api/healthcheck") == -1


def create_api():
    api = FastAPI(
        title="Cognitive API",
        description="<h3>Back-end support for Cognitive application</h3>",
    )

    api.include_router(base_router.router)
    return api


def create_app() -> FastAPI:
    app = FastAPI()
    app.mount("/api", create_api())

    if APP_ENV == "dev":
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["localhost:3000"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    if APP_ENV == "prod":  # pragma: no cover
        logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())

    @app.on_event("startup")
    def _on_startup():
        init_db()

    return app


app = create_app()

if __name__ == "__main__":
    assert APP_ENV == "dev"

    import os
    from pathlib import Path

    os.chdir(Path(__file__).parent)
    os.system("poetry run uvicorn main:app --reload")
