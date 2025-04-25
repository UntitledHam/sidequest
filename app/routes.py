import json
from datetime import date, datetime, timezone
from urllib.parse import urlsplit

from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from app import app, db
from app.forms import Login, Register
from app.models import User


def generate_new_save():
    return json.loads("{}")


@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.now(timezone.utc)
        db.session.commit()


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = Register()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, save=generate_new_save())
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        login_user(user, remember=True)
        flash(f"Registered: {user.username}", "success")
        return redirect(url_for("index"))
    return render_template("register.html", title="Register", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = Login()
    if form.validate_on_submit():
        user = db.session.query(User).where(User.username == form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash("Invalid username or password")
            return redirect(url_for("login"))
        login_user(user, remember=True)
        next_page = request.args.get("next")
        if not next_page or urlsplit(next_page).netloc != "":
            next_page = url_for("index")
        return redirect(next_page)
    return render_template("login.html", title="Log in", form=form)


@login_required
@app.route("/")
def index():
    if not current_user.is_authenticated:
        return redirect(url_for("login"))

    with open("buildings.json", "r") as f:
        buildings = json.load(f)

    tasks = [
        {"name": "Test", "due_date": "1/1", "steps": ["test", "test2", "test3"]},
        {
            "name": "History Project",
            "due_date": "10/12",
            "steps": ["test1", "test2", "test3"],
        },
    ]

    return render_template("home.html", title="Home", tasks=tasks, buildings=buildings)


@app.route("/getbuildingjson", methods=["GET", "POST"])
def getBuildingData():
    with open("buildings.json", "r") as f:
        return json.load(f)


@app.errorhandler(404)
def error404(e):
    return render_template("error404.html", title="Page not found.")


@app.route("/updatesave", methods=["POST"])
def updateSave():
    print("Attempting to recieve save file.")
    data = request.get_json()
    print(data["points"])
    current_user.save = data
    db.session.commit()

    return data, 200


@app.route("/getsave", methods=["GET", "POST"])
def getSave():
    return current_user.save
