from functools import wraps
from flask import session, flash, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            flash("Anda harus login terlebih dahulu!", "error")
            return redirect(url_for('admin.admin_login'))
        return f(*args, **kwargs)
    return decorated_function
