from .auth_routes import auth_bp
from .order_routes import order_bp
from .settings import settings_bp
from .user_routes import user_bp          # NEW

__all__ = ["auth_bp", "order_bp", "user_bp", "register_routes"]   # user_bp added


def register_routes(app):
    """Register all blueprints on the given Flask app."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(user_bp)       # NEW