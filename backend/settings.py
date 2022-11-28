import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent

APP_ENV: str = os.environ["APP_ENV"]
assert APP_ENV in {"dev", "prod"}
