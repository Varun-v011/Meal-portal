import os
from flask import Flask, jsonify, send_from_directory, abort
from flask_cors import CORS
from sqlalchemy import text
from models import db
from routes import register_routes
from models import MealSettings
from routes import settings_bp
from models import AppSettings
from routes.push import push_bp

# The built frontend (npm run build output) lives at ../frontend/dist
# relative to this file. Flask serves it directly so the whole app is one
# process on one port -- no separate Vite dev server needed in production.
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
CORS(app)

# MariaDB connection string: mysql+pymysql://<user>:<password>@localhost:<port>/<database>
#in this pc pass:admin123 for server pc pass:admin1234
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://web_user:admin1234@127.0.0.1:3306/mealportal_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

register_routes(app)

with app.app_context():
    db.create_all()
    MealSettings.seed_defaults()
    AppSettings.seed_defaults()
    
app.register_blueprint(settings_bp)
app.register_blueprint(push_bp)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Flask is connected!"})

@app.route('/api/db-check', methods=['GET'])
def db_check():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({"status": "success", "message": "MariaDB database connected successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Catch-all: serves the React build for every non-API route, and falls back
# to index.html for any path React Router would otherwise handle client-side
# (e.g. a hard refresh on a deep link). /api/... and /uploads/... routes are
# already claimed by their own blueprints above, so this only ever runs for
# genuine frontend paths.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith("api/") or path.startswith("uploads/"):
        abort(404)
    full_path = os.path.join(app.static_folder, path)
    if path and os.path.isfile(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == '__main__':
    # debug=False ALWAYS on this machine -- it sits on a direct public IP
    # with no NAT/router in front of it, so debug=True's interactive
    # in-browser Python console would be reachable by literally anyone on
    # the internet who hits an error page. This is not a "tighten before
    # launch" item, it's a "never turn on" item here.
    #
    # This app.run() line is for local troubleshooting only (visit
    # http://127.0.0.1:5000 on this machine to sanity-check the build).
    # For actual serving, run run_production.py (Waitress) instead --
    # Flask's dev server isn't built to handle real traffic reliably.
    app.run(host='127.0.0.1', port=5000, debug=False)