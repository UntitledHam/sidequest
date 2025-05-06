import re
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, validators, PasswordField, BooleanField
from wtforms.validators import DataRequired
from app import db
from app.models import User


class Login(FlaskForm):
    username = StringField("Username: ", validators=[DataRequired()], render_kw={"class": "form-control", "placeholder": "Username", "type": "text"})
    password = PasswordField("Password: ", validators=[DataRequired()], render_kw={"class": "form-control", "placeholder": "Password", "type": "password"})
    remember_me = BooleanField('Remember Me')
    submit = SubmitField("Login", render_kw={"class": "btn btn-primary"})


class Register(FlaskForm):
    username = StringField("Username: ", validators=[DataRequired()])
    email = StringField("Email: ", validators=[DataRequired(), validators.Email()])
    password = PasswordField("Password: ", validators=[DataRequired()])
    password2 = PasswordField('Repeat Password', validators=[DataRequired(), validators.EqualTo('password')])
    submit = SubmitField("Submit")

    def validate_username(self, field):
        if db.session.query(User).where(User.username == field.data).first() is not None:
            raise validators.ValidationError("Username is already taken.")
        elif not re.match(r'^[a-zA-Z0-9_-]+$', field.data):
            raise validators.ValidationError("Username contains illegal characters. Please use only letters, numbers, underscores, and dashes.")

    def validate_email(self, field):
        if db.session.query(User).where(User.email == field.data).first() is not None:
            raise validators.ValidationError("Email is already taken.")
