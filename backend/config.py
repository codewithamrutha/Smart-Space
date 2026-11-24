"""
SMART SPACE — Backend Configuration
"""

import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent                       # smartspace/

UPLOAD_FOLDER   = BASE_DIR / "uploads"
GENERATED_FOLDER = BASE_DIR / "generated"
MODEL_FOLDER    = BASE_DIR / "models"
DATABASE_FOLDER = BASE_DIR / "database"
DATASET_FOLDER  = BASE_DIR / "dataset"
RUNS_FOLDER     = BASE_DIR / "runs"
DATA_FOLDER     = PROJECT_ROOT / "data"

# Ensure directories exist
for folder in [UPLOAD_FOLDER, GENERATED_FOLDER, MODEL_FOLDER, DATABASE_FOLDER]:
    folder.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DATABASE_PATH = DATABASE_FOLDER / "smartspace.db"

# ---------------------------------------------------------------------------
# File upload limits
# ---------------------------------------------------------------------------

MAX_CONTENT_LENGTH = 10 * 1024 * 1024   # 10 MB
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# ---------------------------------------------------------------------------
# YOLO model
# ---------------------------------------------------------------------------

YOLO_WEIGHTS = MODEL_FOLDER / "best.pt"
YOLO_CONFIDENCE = 0.4

FURNITURE_CLASSES = [
    "Bed", "Sofa", "Chair", "Table",
    "Wardrobe", "Television", "Lamp", "Cabinet"
]

# ---------------------------------------------------------------------------
# Image Generation  (requires API key — set in .env)
# ---------------------------------------------------------------------------

IMAGE_GEN_API_KEY = os.getenv("IMAGE_GEN_API_KEY", "")
IMAGE_GEN_PROVIDER = os.getenv("IMAGE_GEN_PROVIDER", "stability")  # stability | openai

# Stability AI
STABILITY_API_HOST = "https://api.stability.ai"
STABILITY_ENGINE   = "stable-diffusion-xl-1024-v1-0"

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

CORS_ORIGINS = ["*"]   # Allow everything for local development

# ---------------------------------------------------------------------------
# Server
# ---------------------------------------------------------------------------

HOST = os.getenv("FLASK_HOST", "127.0.0.1")
PORT = int(os.getenv("FLASK_PORT", "5000"))
DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
