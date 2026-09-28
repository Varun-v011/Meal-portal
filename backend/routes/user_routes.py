import os
from datetime import timezone, timedelta

from flask import Blueprint, jsonify

from models import db, User, MealOrder, PushSubscription
from auth_utils import admin_required

IST = timezone(timedelta(hours=5, minutes=30))
UPLOADS_ROOT = os.path.abspath(os.path.join(os.getcwd(), "uploads"))

user_bp = Blueprint("users", __name__, url_prefix="/api")


def _user_row(u, order_count):
    created = None
    if u.created_at:
        created = (
            u.created_at.replace(tzinfo=timezone.utc)
            .astimezone(IST)
            .strftime("%d.%m.%Y %H:%M")
        )
    return {
        "id": u.id,
        "name": u.name,
        "department": u.department,
        "mobile_number": u.mobile_number,
        "created_at": created,
        "order_count": order_count,
    }


@user_bp.route("/users", methods=["GET"])
@admin_required
def list_users():
    """Registered (non-admin) users, newest first. order_count lets the
    frontend warn the admin how much data a delete will remove."""
    counts = dict(
        db.session.query(MealOrder.user_id, db.func.count(MealOrder.id))
        .group_by(MealOrder.user_id)
        .all()
    )
    users = (
        User.query.filter(db.or_(User.role != "admin", User.role.is_(None)))
        .order_by(User.created_at.desc())
        .all()
    )
    return jsonify([_user_row(u, counts.get(u.id, 0)) for u in users]), 200


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"errors": ["User not found."]}), 404
    if user.role == "admin":
        return jsonify({"errors": ["Admin accounts cannot be deleted."]}), 403

    # meal_orders and push_subscriptions both hold a foreign key to users.id,
    # so they must go first or the DB rejects the user delete.
    screenshots = [
        o.payment_screenshot
        for o in MealOrder.query.filter_by(user_id=user.id).all()
        if o.payment_screenshot
    ]
    PushSubscription.query.filter_by(user_id=user.id).delete()
    MealOrder.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()

    # Best-effort cleanup of the payment screenshot files (after the DB
    # commit, so a file problem can never leave the delete half-done).
    for rel in screenshots:
        path = os.path.abspath(os.path.join(UPLOADS_ROOT, rel))
        if path.startswith(UPLOADS_ROOT + os.sep):
            try:
                os.remove(path)
            except OSError:
                pass

    return jsonify({"message": "User deleted."}), 200