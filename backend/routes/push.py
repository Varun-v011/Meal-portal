from flask import Blueprint, request, jsonify, g
from models import db, PushSubscription
from auth_utils import login_required

push_bp = Blueprint("push", __name__, url_prefix="/api")


@push_bp.route("/push/vapid-public-key", methods=["GET"])
def get_vapid_public_key():
    """Public — frontend needs this to call PushManager.subscribe()."""
    return jsonify({"publicKey": "BG9-VPAzkNF4oGmUhGA3eNmfDYTZZU2iuUwq00BMZoogcZvwrYXsW2-C8xlPuDuQKzjCcT7EGP_FU6eGB88O5Ug"}), 200


@push_bp.route("/push/subscribe", methods=["POST"])
@login_required
def subscribe():
    data = request.get_json(silent=True) or {}
    endpoint = data.get("endpoint")
    keys = data.get("keys") or {}
    p256dh = keys.get("p256dh")
    auth = keys.get("auth")

    if not endpoint or not p256dh or not auth:
        return jsonify({"errors": ["Invalid subscription data."]}), 400

    existing = PushSubscription.query.filter_by(endpoint=endpoint).first()
    if existing:
        existing.user_id = g.current_user.id
        existing.p256dh = p256dh
        existing.auth = auth
    else:
        db.session.add(PushSubscription(
            user_id=g.current_user.id,
            endpoint=endpoint,
            p256dh=p256dh,
            auth=auth,
        ))
    db.session.commit()
    return jsonify({"message": "Subscribed."}), 201


@push_bp.route("/push/unsubscribe", methods=["POST"])
@login_required
def unsubscribe():
    data = request.get_json(silent=True) or {}
    endpoint = data.get("endpoint")
    if endpoint:
        PushSubscription.query.filter_by(endpoint=endpoint).delete()
        db.session.commit()
    return jsonify({"message": "Unsubscribed."}), 200