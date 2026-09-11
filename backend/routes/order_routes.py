from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from datetime import datetime, date
from models import db, MealOrder, User
import os, uuid
from auth_utils import admin_required   

order_bp = Blueprint("orders", __name__, url_prefix="/api")

MEAL_PRICES = {"breakfast": 100, "lunch": 120, "dinner": 150}
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "payment_screenshots")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@order_bp.route("/orders", methods=["POST"])
def create_order():
    user_id = request.form.get("user_id")
    meal_type = request.form.get("meal_type")
    quantity = request.form.get("quantity", type=int)
    ordered_for = request.form.get("ordered_for")  # "YYYY-MM-DD"
    file = request.files.get("payment_screenshot")

    errors = []
    if not user_id or not User.query.get(user_id):
        errors.append("Valid user is required.")
    if meal_type not in MEAL_PRICES:
        errors.append("Meal type must be breakfast, lunch, or dinner.")
    if not quantity or quantity < 1 or quantity > 10:
        errors.append("Quantity must be between 1 and 10.")
    if not ordered_for:
        errors.append("Ordered-for date is required.")
    if not file or file.filename == "":
        errors.append("Payment screenshot is required.")
    elif not allowed_file(file.filename):
        errors.append("Screenshot must be JPG, JPEG, or PNG.")

    if errors:
        return jsonify({"errors": errors}), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    amount = MEAL_PRICES[meal_type] * quantity

    order = MealOrder(
        user_id=user_id,
        meal_type=meal_type,
        quantity=quantity,
        amount=amount,
        order_date=date.today(),
        ordered_for=datetime.strptime(ordered_for, "%Y-%m-%d").date(),
        payment_screenshot=f"payment_screenshots/{filename}",
        status="pending",
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({"message": "Order placed, pending confirmation.", "order_id": order.id}), 201


@order_bp.route("/orders/pending", methods=["GET"])
@admin_required
def pending_orders():
    orders = MealOrder.query.filter_by(status="pending").all()
    return jsonify([_order_dict(o) for o in orders]), 200


@order_bp.route("/orders/confirmed-today", methods=["GET"])
@admin_required
def confirmed_today():
    orders = MealOrder.query.filter_by(status="confirmed", ordered_for=date.today()).all()
    return jsonify([_order_dict(o) for o in orders]), 200


@order_bp.route("/orders/<int:order_id>/review", methods=["PATCH"])
@admin_required
def review_order(order_id):
    data = request.get_json(silent=True) or {}
    action = data.get("action")  # "confirm" | "reject"
    remarks = data.get("remarks")

    order = MealOrder.query.get(order_id)
    if not order:
        return jsonify({"errors": ["Order not found."]}), 404
    if action not in ("confirm", "reject"):
        return jsonify({"errors": ["Action must be 'confirm' or 'reject'."]}), 400

    order.status = "confirmed" if action == "confirm" else "rejected"
    order.remarks = remarks
    db.session.commit()

    return jsonify({"message": f"Order {order.status}.", "order": _order_dict(order)}), 200


@order_bp.route("/orders/history", methods=["GET"])
def order_history():
    user_id = request.args.get("user_id")
    start = request.args.get("from")
    end = request.args.get("to")

    query = MealOrder.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    if start and end:
        query = query.filter(
            MealOrder.ordered_for.between(
                datetime.strptime(start, "%Y-%m-%d").date(),
                datetime.strptime(end, "%Y-%m-%d").date(),
            )
        )
    orders = query.order_by(MealOrder.created_at.desc()).all()
    return jsonify([_order_dict(o) for o in orders]), 200


def _order_dict(o):
    return {
        "id": o.id,
        "employee": o.user.name,
        "worker_id": o.user.worker_id,
        "meal_type": o.meal_type,
        "quantity": o.quantity,
        "amount": str(o.amount),
        "order_date": o.order_date.isoformat(),
        "ordered_for": o.ordered_for.isoformat(),
        "payment_screenshot": o.payment_screenshot,
        "status": o.status,
        "remarks": o.remarks,
    }