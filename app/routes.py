from flask import render_template
import json

from app import app, db


@app.route("/")
def index():
    buildings = [
        {
            "name": "Gup",
            "description": "A small cat that generates points by purring.",
            "amount": 0
        },
        {
            "name": "Skinnerbox",
            "description": "A box with a small rat that generates points by clicking a button.",
            "amount": 5
        },
        {
            "name": "Test",
            "description": "This is a test, do not mind.",
            "amount": 0
        }
    ]

    tasks = [
        {
            "name": "Test",
            "due_date": "1/1",
            "steps": [
                "test",
                "test2",
                "test3"
            ]
        },
        {
            "name": "History Project",
            "due_date": "10/12",
            "steps": [
                "test1",
                "test2",
                "test3"
            ]
        }
    ]
    return render_template("home.html", title="Home", tasks=tasks, buildings=buildings)
