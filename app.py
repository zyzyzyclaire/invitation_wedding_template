from flask import Flask, render_template, request, jsonify, redirect, session
from flask_bcrypt import Bcrypt

from models import session_scope, User
from config import secret_key, bcrypt_level
from views.index import geocoding


from views.template_dummy import groom_dict, bride_dict, wedding_schedule_dict, message_templates_dict, transport_list, guestbook_list, image_list, bank_acc
groom_dict = groom_dict # 신랑 데이터
bride_dict = bride_dict # 신부 데이터
wedding_schedule_dict = wedding_schedule_dict # 장소와 시간 데이터
message_templates_dict = message_templates_dict # 글귀 데이터
transport_list = transport_list # 교통 수단 데이터
guestbook_list = guestbook_list # 방명록 데이터
image_list = image_list # 이미지 데이터
bank_acc = bank_acc # 계좌번호 데이터


app = Flask(__name__)

app.config['SECRET_KEY'] = secret_key
app.config['BCRYPT_LEVEL'] = bcrypt_level

bcrypt = Bcrypt(app) 


@app.route("/")
def index():
    with session_scope() as db_session:
        test = db_session.query(User).filter(User.id == 1).first()
        name = test.name
        # 더미 존
        from views.template_dummy import groom_dict, bride_dict, wedding_schedule_dict, message_templates_dict, transport_list, guestbook_list, image_list
        groom_dict = groom_dict # 신랑 데이터
        bride_dict = bride_dict # 신부 데이터
        wedding_schedule_dict = wedding_schedule_dict # 장소와 시간 데이터
        message_templates_dict = message_templates_dict # 글귀 데이터
        transport_list = transport_list # 교통 수단 데이터
        guestbook_list = guestbook_list # 방명록 데이터
        image_list = image_list # 이미지 데이터
        print(geocoding("부산시 사하구 낙동남로 1353번길 31"))
    return render_template('/index.html',  
                           groom_dict=groom_dict, 
                           bride_dict=bride_dict,
                           wedding_schedule_dict=wedding_schedule_dict,
                           message_templates_dict=message_templates_dict,
                           transport_list=transport_list,
                           guestbook_list=guestbook_list,
                           image_list=image_list,
                           bank_acc=bank_acc
                           )

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('/login.html')
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        response = jsonify({'message': 'Success'})
        response.status_code = 200
        return response
    
@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('/register.html')
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        response = jsonify({'message': 'Success'})
        response.status_code = 200
        return response


@app.route("/create")
def create():
    return render_template('/create.html',  
                        groom_dict=groom_dict, 
                        bride_dict=bride_dict,
                        wedding_schedule_dict=wedding_schedule_dict,
                        message_templates_dict=message_templates_dict,
                        transport_list=transport_list,
                        guestbook_list=guestbook_list,
                        image_list=image_list,
                        bank_acc=bank_acc)


@app.route("/create_account", methods=['GET', 'POST'])
def create_account():
    name = request.form.get('name')
    id = request.form.get('id')
    pwd = request.form.get('pwd')
    email = request.form.get('email')

    with session_scope() as db_session:
            user_item = User(name, id, pwd, email)
            db_session.add(user_item)
            db_session.commit()
            db_session.refresh(user_item)

    return render_template('/create.html')


@app.route('/login_check', methods=['GET','POST'])  
def login_check():
    # session['token']=request.form.get('token')
    id = request.form.get('id')
    pw = request.form.get('pw')

    with session_scope() as db_session:
        user_item = db_session.query(User)\
                            .filter(User.user_id == id)\
                            .filter(User.user_pw == bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()))\
                            .first()
        if user_item:   # 로그인 성공
            print("로그인성공")
            session['user']=user_item.user
            return redirect('/login')
        else:           # 로그인 실패
            print("로그인실패")
            return redirect('/login')


if __name__ == '__main__':
    app.run()
