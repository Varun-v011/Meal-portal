import os
from pywebpush import webpush, WebPushException
from models import PushSubscription, db

VAPID_PRIVATE_KEY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "private_key.pem")
VAPID_CLAIMS = {"sub": "mailto:admin@sapaadubooking.in"}  # change to a real contact if you have one


def send_push_to_user(user_id, title, body, url="/"):
    """Sends a push notification to every device a given user is subscribed on.
    Silently removes subscriptions that are no longer valid (expired/unsubscribed)."""
    subs = PushSubscription.query.filter_by(user_id=user_id).all()
    _send_to_subscriptions(subs, title, body, url)


def send_push_to_admins(title, body, url="/"):
    """Sends a push notification to every admin's subscribed devices."""
    from models import User
    admin_ids = [u.id for u in User.query.filter_by(role="admin").all()]
    subs = PushSubscription.query.filter(PushSubscription.user_id.in_(admin_ids)).all()
    _send_to_subscriptions(subs, title, body, url)


def _send_to_subscriptions(subs, title, body, url):
    import json
    payload = json.dumps({"title": title, "body": body, "url": url})

    for sub in subs:
        try:
            webpush(
                subscription_info=sub.to_subscription_info(),
                data=payload,
                vapid_private_key=VAPID_PRIVATE_KEY_FILE,
                vapid_claims=VAPID_CLAIMS.copy(),
            )
        except WebPushException as ex:
            # 404/410 means the subscription is dead (browser unsubscribed,
            # device reset, etc) — clean it up so we stop trying.
            if ex.response is not None and ex.response.status_code in (404, 410):
                db.session.delete(sub)
        except Exception:
            pass  # don't let one bad subscription break the whole batch

    db.session.commit()