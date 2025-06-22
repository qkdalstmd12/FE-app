from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Feedback(db.Model):
    __tablename__ = 'feedbacks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    recommend = db.Column(db.Boolean, nullable=False)
    comment = db.Column(db.String(255), nullable=False)
    completed_at = db.Column(db.String(50), nullable=False)
