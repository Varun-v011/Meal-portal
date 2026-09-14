from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db
from models import MealSettings
from auth_utils import admin_required

settings_bp = Blueprint("settings", __name__, url_prefix="/api")

VALID_MEAL_TYPES = {"breakfast", "lunch", "dinner"}


@settings_bp.route("/meal-settings", methods=["GET"])
def get_meal_settings():
    """Public — the client order form reads this to know what's available,
    at what price, and until when."""
    rows = MealSettings.query.all()
    return jsonify([r.to_dict() for r in rows]), 200


@settings_bp.route("/meal-settings/<meal_type>", methods=["PUT"])
@admin_required
def update_meal_settings(meal_type):
    if meal_type not in VALID_MEAL_TYPES:
        return jsonify({"errors": ["Meal type must be breakfast, lunch, or dinner."]}), 400

    data = request.get_json(silent=True) or {}
    row = MealSettings.query.filter_by(meal_type=meal_type).first()
    if not row:
        row = MealSettings(meal_type=meal_type)
        db.session.add(row)

    errors = []

    if "is_available" in data:
        if not isinstance(data["is_available"], bool):
            errors.append("is_available must be true or false.")
        else:
            row.is_available = data["is_available"]

    if "price" in data:
        try:
            price = float(data["price"])
            if price < 0:
                raise ValueError
            row.price = price
        except (TypeError, ValueError):
            errors.append("Price must be a non-negative number.")

    if "closing_time" in data:
        ct = data["closing_time"]
        if ct in (None, ""):
            row.closing_time = None
        else:
            try:
                row.closing_time = datetime.strptime(ct, "%H:%M").time()
            except ValueError:
                errors.append("Closing time must be in HH:MM format.")

    if errors:
        db.session.rollback()
        return jsonify({"errors": errors}), 400

    db.session.commit()
    return jsonify({"message": "Meal settings updated.", "settings": row.to_dict()}), 200