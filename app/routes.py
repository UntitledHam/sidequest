from flask import render_template
import json

from app import app, db


@app.route("/")
def index():
    buildings = [
        {
            "name": "Gup",
            "description": "A small cat that generates points by purring.",
            "amount": 23
        },
        {
            "name": "Skinnerbox",
            "description": "A box with a small rat that generates points by clicking a button.",
            "amount": 5
        },
    ]
    return render_template("home.html", title="Home", buildings=buildings)
