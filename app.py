from flask import Flask, render_template, request, jsonify
from models import session_scope, User

from views.template.index import geocoding

app = Flask(__name__)

@app.route("/")
def index():
    with session_scope() as session:
        test = session.query(User).filter(User.id == 1).first()
        name = test.name
        print(geocoding("부산시 연제구 거제대로 198"))
    return render_template('/index.html', test=name)

@app.route("/login")
def login():
    return render_template('/login.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('/register.html')
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        response = jsonify({'message': 'success'})
        response.status_code = 200
        return response
    


@app.route("/create")
def create():
    return render_template('/create.html')

if __name__ == '__main__':
    app.run()
