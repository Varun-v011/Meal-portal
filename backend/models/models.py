from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    worker_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    mobile_number = db.Column(db.String(15), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="worker")  # "worker" or "admin"
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "worker_id": self.worker_id,
            "mobile_number": self.mobile_number,
            "department": self.department,
            "role": self.role,
        }