"""
SMART SPACE — Database initialisation and helpers (SQLite)
"""

import sqlite3
import uuid
from datetime import datetime
from pathlib import Path

from config import DATABASE_PATH


def get_db():
    """Return a new connection with row-factory enabled."""
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create all tables if they do not already exist."""
    conn = get_db()
    cur = conn.cursor()

    cur.executescript("""
    -- Users (optional backend auth)
    CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        email       TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at  TEXT NOT NULL
    );

    -- Room projects
    CREATE TABLE IF NOT EXISTS projects (
        id              TEXT PRIMARY KEY,
        user_email      TEXT,
        room_type       TEXT NOT NULL,
        length          REAL,
        width           REAL,
        height          REAL,
        windows         INTEGER DEFAULT 2,
        doors           INTEGER DEFAULT 1,
        floor_type      TEXT,
        design_style    TEXT,
        color_palette   TEXT,
        furniture_prefs TEXT,          -- JSON array
        lighting        TEXT,
        budget          TEXT,
        special_requirements TEXT,
        uploaded_image  TEXT,          -- filename in uploads/
        generated_image TEXT,          -- filename in generated/
        detected_furniture TEXT,       -- JSON array of detections
        recommendations TEXT,          -- JSON array of product IDs
        scene_data      TEXT,          -- JSON 3D scene
        layout_data     TEXT,          -- JSON saved layout
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL
    );

    -- Saved 3D layouts (one project can have many saved layouts)
    CREATE TABLE IF NOT EXISTS saved_layouts (
        id          TEXT PRIMARY KEY,
        project_id  TEXT NOT NULL REFERENCES projects(id),
        name        TEXT DEFAULT 'Untitled',
        layout_json TEXT NOT NULL,
        created_at  TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()


def new_id():
    """Generate a short unique ID."""
    return uuid.uuid4().hex[:12]


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


# ---------------------------------------------------------------------------
# Project helpers
# ---------------------------------------------------------------------------

def create_project(data: dict) -> str:
    """Insert a new project row; return its id."""
    import json

    pid = new_id()
    ts = now_iso()
    conn = get_db()
    conn.execute(
        """INSERT INTO projects
           (id, user_email, room_type, length, width, height,
            windows, doors, floor_type,
            design_style, color_palette, furniture_prefs,
            lighting, budget, special_requirements,
            uploaded_image, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (
            pid,
            data.get("user_email", ""),
            data.get("room_type", ""),
            data.get("length"),
            data.get("width"),
            data.get("height"),
            data.get("windows", 2),
            data.get("doors", 1),
            data.get("floor_type", ""),
            data.get("design_style", ""),
            data.get("color_palette", ""),
            json.dumps(data.get("furniture", [])),
            data.get("lighting", ""),
            data.get("budget", ""),
            data.get("special_requirements", ""),
            data.get("uploaded_image", ""),
            ts, ts,
        ),
    )
    conn.commit()
    conn.close()
    return pid


def update_project(pid: str, fields: dict):
    """Update specific fields on a project row."""
    conn = get_db()
    sets = ", ".join(f"{k} = ?" for k in fields)
    vals = list(fields.values()) + [now_iso(), pid]
    conn.execute(
        f"UPDATE projects SET {sets}, updated_at = ? WHERE id = ?", vals
    )
    conn.commit()
    conn.close()


def get_project(pid: str) -> dict | None:
    conn = get_db()
    row = conn.execute("SELECT * FROM projects WHERE id = ?", (pid,)).fetchone()
    conn.close()
    return dict(row) if row else None


def save_layout(project_id: str, name: str, layout_json: str) -> str:
    lid = new_id()
    conn = get_db()
    conn.execute(
        "INSERT INTO saved_layouts (id, project_id, name, layout_json, created_at) VALUES (?,?,?,?,?)",
        (lid, project_id, name, layout_json, now_iso()),
    )
    conn.commit()
    conn.close()
    return lid


def get_saved_layouts(project_id: str) -> list:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM saved_layouts WHERE project_id = ? ORDER BY created_at DESC",
        (project_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
