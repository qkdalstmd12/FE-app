from flask import Flask
from models import db
from routes.today_routes import route_bp as today_bp
from routes.recommended_routes import route_bp as recommended_bp
from routes.new_route import route_bp as new_bp
from routes.free_route import route_bp as free_bp
from routes.save_route import route_bp as save_bp
from routes.running_summary import route_bp as summary_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/runify_feedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.register_blueprint(today_bp)
app.register_blueprint(recommended_bp)
app.register_blueprint(new_bp)
app.register_blueprint(free_bp)
app.register_blueprint(save_bp)
app.register_blueprint(summary_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=3658, debug=True)
