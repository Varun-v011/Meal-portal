from functools import wraps
from flask import request, jsonify, g
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


def login_required(f):
    """Identifies the requester via X-User-Id (any role) and stashes them on
    flask.g.current_user for the view to use. Unlike admin_required, this
    does not restrict by role — it just proves who's asking."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        if not user_id:
            return jsonify({"errors": ["Missing X-User-Id header."]}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"errors": ["Invalid user."]}), 401

        g.current_user = user
        return f(*args, **kwargs)
    return decorated