from datetime import datetime, timezone
from models import db


class PushSubscription(db.Model):
    """One row per browser/device a user has enabled push notifications on.
    A single user can have multiple (phone + laptop, etc)."""
    __tablename__ = "push_subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    endpoint = db.Column(db.String(500), unique=True, nullable=False)
    p256dh = db.Column(db.String(255), nullable=False)
    auth = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", backref="push_subscriptions")

    def to_subscription_info(self):
        """Shape pywebpush expects for sending a notification."""
        return {
            "endpoint": self.endpoint,
            "keys": {"p256dh": self.p256dh, "auth": self.auth},
        }