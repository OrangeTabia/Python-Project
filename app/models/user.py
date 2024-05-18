from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from .db import db, environment, SCHEMA, add_prefix_for_prod



class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    profile_image = db.Column(db.String(1000), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    comments = db.relationship('Comment', back_populates='user')
    payments = db.relationship('Payment', back_populates='user')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'profileImage': self.profile_image,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }


class Friend(db.Model):
    __tablename__ = 'friends'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod(User.id)), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod(User.id)), nullable=False)

    user = db.relationship(User, foreign_keys='Friend.user_id', backref='user')
    friend = db.relationship(User, foreign_keys='Friend.friend_id', backref='friend')
