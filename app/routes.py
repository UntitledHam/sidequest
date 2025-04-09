from flask import render_template

from app import app, db


@app.route("/")
def index():
    buildings = [
        {
            "name": "Gup",
            "description": "A small cat that generates points by purring."
        },
        {
            "name": "Skinnerbox",
            "description": "A box with a small rat that generates points by clicking a button.",
        },
    ]
    return render_template("home.html", title="Home", buildings=buildings)
