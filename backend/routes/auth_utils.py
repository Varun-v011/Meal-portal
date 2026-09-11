from functools import wraps
from flask import request, jsonify
from models import User

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        admin_id = request.headers.get("X-User-Id")
        if not admin_id:
            return jsonify({"errors": ["Missing X-User-Id header."]}), 401

        user = User.query.get(admin_id)
        if not user or user.role != "admin":
            return jsonify({"errors": ["Admin access required."]}), 403

        return f(*args, **kwargs)
    return decorated