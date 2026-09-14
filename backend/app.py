from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text
from models import db
from routes import register_routes
from models import MealSettings
from routes import settings_bp


app = Flask(__name__)
CORS(app)

# MariaDB connection string: mysql+pymysql://<user>:<password>@localhost:<port>/<database>
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://web_user:admin123@127.0.0.1:3306/web_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

register_routes(app)

with app.app_context():
    db.create_all()
    MealSettings.seed_defaults()

app.register_blueprint(settings_bp)

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)