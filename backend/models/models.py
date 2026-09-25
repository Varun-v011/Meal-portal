from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    mobile_number = db.Column(db.String(15), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="staff")  # "staff" or "admin"
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "mobile_number": self.mobile_number,
            "department": self.department,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class AppSettings(db.Model):
    """Single-row table for app-wide toggles that aren't specific to any
    one meal. Always row id=1 — read/write that row directly."""
    __tablename__ = "app_settings"

    id = db.Column(db.Integer, primary_key=True)
    screenshot_required = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        return {"screenshot_required": self.screenshot_required}

    @staticmethod
    def seed_defaults():
        if not AppSettings.query.get(1):
            db.session.add(AppSettings(id=1, screenshot_required=True))
            db.session.commit()

    @staticmethod
    def get():
        return AppSettings.query.get(1)