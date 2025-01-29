from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3100"}})

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///biblioteka.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

import routes
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
