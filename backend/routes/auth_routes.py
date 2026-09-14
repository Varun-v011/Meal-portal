from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import re

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

MOBILE_RE = re.compile(r"^[6-9]\d{9}$")  # adjust if you need non-Indian numbers
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_registration(data):
    errors = []
    name = (data.get("name") or "").strip()
    worker_id = (data.get("worker_id") or "").strip()
    mobile_number = (data.get("mobile_number") or "").strip()
    department = (data.get("department") or "").strip() or None
    email = (data.get("email") or "").strip() or None
    password = data.get("password") or ""
    confirm_password = data.get("confirm_password") or ""

    if not name or len(name) < 2:
        errors.append("Name is required.")
    if not worker_id or len(worker_id) < 2:
        errors.append("Employee/Contract Worker ID is required.")
    if not mobile_number or not MOBILE_RE.match(mobile_number):
        errors.append("A valid 10-digit mobile number is required.")
    if email and not EMAIL_RE.match(email):
        errors.append("Email address is invalid.")
    if not password or len(password) < 6:
        errors.append("Password must be at least 6 characters.")
    if password != confirm_password:
        errors.append("Password and confirm password do not match.")

    return errors, name, worker_id, mobile_number, department, email, password


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    errors, name, worker_id, mobile_number, department, email, password = validate_registration(data)
    if errors:
        return jsonify({"errors": errors}), 400

    conflict_filters = [User.worker_id == worker_id, User.mobile_number == mobile_number]
    if email:
        conflict_filters.append(User.email == email)

    existing = User.query.filter(db.or_(*conflict_filters)).first()
    if existing:
        if existing.worker_id == worker_id:
            msg = "Worker ID already registered."
        elif existing.mobile_number == mobile_number:
            msg = "Mobile number already registered."
        else:
            msg = "Email already registered."
        return jsonify({"errors": [msg]}), 409

    user = User(
        name=name,
        worker_id=worker_id,
        mobile_number=mobile_number,
        department=department,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful.", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    worker_id = (data.get("worker_id") or "").strip()
    password = data.get("password") or ""

    if not worker_id or not password:
        return jsonify({"errors": ["Worker ID and password are required."]}), 400

    user = User.query.filter_by(worker_id=worker_id).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"errors": ["Invalid Worker ID or password."]}), 401

    return jsonify({"message": "Login successful.", "user": user.to_dict()}), 200