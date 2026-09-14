from datetime import datetime, timezone
from models import db


class MealSettings(db.Model):
    """One row per meal type (breakfast/lunch/dinner) controlling what the
    client sees: whether it can be ordered right now, at what price, and
    until what time of day."""
    __tablename__ = "meal_settings"

    id = db.Column(db.Integer, primary_key=True)
    meal_type = db.Column(db.String(20), unique=True, nullable=False)  # breakfast | lunch | dinner
    is_available = db.Column(db.Boolean, nullable=False, default=True)
    price = db.Column(db.Numeric(8, 2), nullable=False, default=0)
    closing_time = db.Column(db.Time, nullable=True)  # None = no cutoff, order any time
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "meal_type": self.meal_type,
            "is_available": self.is_available,
            "price": str(self.price),
            "closing_time": self.closing_time.strftime("%H:%M") if self.closing_time else None,
        }

    @staticmethod
    def seed_defaults():
        """Ensure a row exists for each meal type. Call once at startup,
        after db.create_all(). Safe to call repeatedly."""
        defaults = {
            "breakfast": {"price": 60, "closing_time": None},
            "lunch": {"price": 90, "closing_time": None},
            "dinner": {"price": 110, "closing_time": None},
        }
        for meal_type, vals in defaults.items():
            if not MealSettings.query.filter_by(meal_type=meal_type).first():
                db.session.add(MealSettings(meal_type=meal_type, is_available=True, **vals))
        db.session.commit()