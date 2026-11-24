"""
SMART SPACE — Shared utilities
"""

import os
import uuid
from pathlib import Path
from werkzeug.utils import secure_filename

from config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER


def allowed_file(filename: str) -> bool:
    """Check whether a filename has an allowed image extension."""
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def save_upload(file_storage) -> str:
    """
    Save an uploaded file (werkzeug FileStorage) into uploads/.
    Returns the unique filename.
    """
    original = secure_filename(file_storage.filename or "image.jpg")
    ext = original.rsplit(".", 1)[-1] if "." in original else "jpg"
    unique_name = f"{uuid.uuid4().hex[:10]}_{original}"
    dest = UPLOAD_FOLDER / unique_name
    file_storage.save(str(dest))
    return unique_name


def make_response_ok(data: dict = None, message: str = "success"):
    """Standard success response."""
    body = {"status": "success", "message": message}
    if data is not None:
        body["data"] = data
    return body


def make_response_error(message: str, status: int = 400):
    """Standard error response (returns tuple for Flask)."""
    return {"status": "error", "message": message}, status
