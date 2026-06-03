import os
from flask import Flask, redirect, url_for, flash, send_from_directory
from werkzeug.exceptions import RequestEntityTooLarge
from dotenv import load_dotenv
from database import load_web_config

# Load environment variables
load_dotenv()

# Secure static folder to prevent exposure of root directory files
app = Flask(__name__, static_folder=None)

# Explicitly define routes for assets
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-key-sdn-bobong")
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # Limit size to 1MB

@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    flash("Ukuran file terlalu besar! Maksimal ukuran file adalah 1MB.", "error")
    return redirect(url_for('admin.admin_dashboard') + '?tab=teachers')

# --- Global Context Processor ---
@app.context_processor
def inject_global_data():
    config = load_web_config()
    return {
        "global_announcements": config.get("marquee_announcements", []),
        "global_stats": config.get("stats", {})
    }

# Register Blueprints
from routes import public_bp, admin_bp
app.register_blueprint(public_bp)
app.register_blueprint(admin_bp)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
