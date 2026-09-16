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
    mobile_number = (data.get("mobile_number") or "").strip()
    department = (data.get("department") or "").strip()
    email = (data.get("email") or "").strip() or None
    password = data.get("password") or ""
    confirm_password = data.get("confirm_password") or ""

    if not name or len(name) < 2:
        errors.append("Name is required.")
    if not mobile_number or not MOBILE_RE.match(mobile_number):
        errors.append("A valid 10-digit mobile number is required.")
    if not department:
        errors.append("Department is required.")
    if email and not EMAIL_RE.match(email):
        errors.append("Email address is invalid.")
    if not password or len(password) < 6:
        errors.append("Password must be at least 6 characters.")
    if password != confirm_password:
        errors.append("Password and confirm password do not match.")

    return errors, name, mobile_number, department, email, password


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    errors, name, mobile_number, department, email, password = validate_registration(data)
    if errors:
        return jsonify({"errors": errors}), 400

    conflict_filters = [User.name == name, User.mobile_number == mobile_number]
    if email:
        conflict_filters.append(User.email == email)

    existing = User.query.filter(db.or_(*conflict_filters)).first()
    if existing:
        if existing.name == name:
            msg = "That name is already registered."
        elif existing.mobile_number == mobile_number:
            msg = "Mobile number already registered."
        else:
            msg = "Email already registered."
        return jsonify({"errors": [msg]}), 409

    user = User(
        name=name,
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
    mobile_number = (data.get("mobile_number") or "").strip()
    password = data.get("password") or ""

    if not mobile_number or not password:
        return jsonify({"errors": ["Mobile number and password are required."]}), 400

    user = User.query.filter_by(mobile_number=mobile_number).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"errors": ["Invalid mobile number or password."]}), 401

    return jsonify({"message": "Login successful.", "user": user.to_dict()}), 200


@auth_bp.route("/forgot-password/verify", methods=["POST"])
def forgot_password_verify():
    """Step 1 of the reset flow: confirm name + mobile_number belong to
    the same account before letting the user type a new password. Same
    generic error either way — never reveals which field was wrong."""
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    mobile_number = (data.get("mobile_number") or "").strip()

    errors = []
    if not name:
        errors.append("Name is required.")
    if not mobile_number or not MOBILE_RE.match(mobile_number):
        errors.append("A valid 10-digit mobile number is required.")
    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(name=name).first()
    if not user or user.mobile_number != mobile_number:
        return jsonify({"errors": ["Name and mobile number do not match our records."]}), 401

    return jsonify({"message": "Verified.", "verified": True}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """Step 2: sets the new password. Re-checks name + mobile_number
    server-side too (defense in depth) — the frontend's earlier /verify call
    doesn't issue a token, so this call is trusted no more than any other
    unauthenticated request and must re-validate the match itself."""
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    mobile_number = (data.get("mobile_number") or "").strip()
    password = data.get("password") or ""
    confirm_password = data.get("confirm_password") or ""

    errors = []
    if not name:
        errors.append("Name is required.")
    if not mobile_number or not MOBILE_RE.match(mobile_number):
        errors.append("A valid 10-digit mobile number is required.")
    if not password or len(password) < 6:
        errors.append("Password must be at least 6 characters.")
    if password != confirm_password:
        errors.append("Password and confirm password do not match.")

    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(name=name).first()

    # Same generic message whether the name doesn't exist or the mobile
    # number doesn't match it — avoids confirming which names are real.
    if not user or user.mobile_number != mobile_number:
        return jsonify({"errors": ["Name and mobile number do not match our records."]}), 401

    user.password_hash = generate_password_hash(password)
    db.session.commit()

    return jsonify({"message": "Password reset successful. You can now sign in."}), 200