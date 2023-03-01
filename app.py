from flask import Flask,render_template
from models import session_scope, User

app = Flask(__name__)

@app.route("/")
def index():
    with session_scope() as session:
        test = session.query(User).filter(User.id == 1).first()
    return render_template('/index.html', test=test)

if __name__ == '__main__':
    app.run()
