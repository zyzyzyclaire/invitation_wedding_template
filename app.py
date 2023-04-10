from flask import Flask, render_template, request, jsonify, redirect, session
import bcrypt
# from flask_bcrypt import Bcrypt
import json

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

# bcrypt_app = Bcrypt(app) 


@app.route("/")
def index():
    with session_scope() as db_session:
        test = db_session.query(User).filter(User.id == 1).first()
        # name = test.name
        # 더미 존
        from views.template_dummy import groom_dict, bride_dict, wedding_schedule_dict, message_templates_dict, guestbook_list, image_list, transport_list
        groom_dict = groom_dict # 신랑 데이터
        bride_dict = bride_dict # 신부 데이터
        wedding_schedule_dict = wedding_schedule_dict # 장소와 시간 데이터
        message_templates_dict = message_templates_dict # 글귀 데이터
        transport_list = transport_list # 교통 수단 데이터
        guestbook_list = guestbook_list # 방명록 데이터
        
        image_list = image_list # 이미지 데이터
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
        
        id = data['id']
        pw = data['password']

        with session_scope() as db_session:
            user_item = db_session.query(User)\
                                .filter(User.user_id == id)\
                                .first()
            
            print("user",user_item)
            if user_item and bcrypt.checkpw(pw.encode('utf-8'), user_item.user_pw.encode('utf-8')):   # 로그인 성공
                print("로그인성공")
                session['user']=user_item.user_id
                response = jsonify({'message': 'Success'})
                response.status_code = 200
            else:           # 로그인 실패
                print("로그인실패")
                response = jsonify({'message': 'Success'})
                response.status_code = 401
            
            return response
    
@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('/register.html')
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        
        name = data['name']
        id = data['id']
        pwd = data['password']
        email = data['email']

        with session_scope() as db_session:
            user_item = User(name, id, pwd, email)
            db_session.add(user_item)
            db_session.commit()
            db_session.refresh(user_item)
        response = jsonify({'message': 'Success'})
        response.status_code = 200
        return response


@app.route("/create", methods=['GET', 'POST'])
def create():
    if request.method == 'GET':
        # from views.template_dummy_for_html import groom_dict, bride_dict, bank_acc, wedding_schedule_dict, message_templates_dict, transport_list, guestbook_list
        # groom_dict = groom_dict
        # bride_dict = bride_dict
        # bank_acc = bank_acc
        # wedding_schedule_dict = wedding_schedule_dict
        # message_templates_dict = message_templates_dict
        # guestbook_list = guestbook_list
        return render_template('/create.html',  
                            groom_dict=groom_dict, 
                            bride_dict=bride_dict,
                            wedding_schedule_dict=wedding_schedule_dict,
                            message_templates_dict=message_templates_dict,
                            transport_list=transport_list,
                            guestbook_list=guestbook_list,
                            image_list=image_list,
                            bank_acc=bank_acc)
        
    if request.method == 'POST':
        # data = request.get_json()
        print(request.files)
        main_img_file = request.files['main_img']
        sub_img_file = request.files['sub_img']
        # gallery_img_files = [v for k, v in request.files.items() if k.startswith('gallery_img')]
        gallery_img = {}
        gallery_img_sm = {}

        for k, v in request.files.items():
            if k.startswith('gallery_img') and k.endswith('[img]'):
                idx = int(k.split('[')[1].split(']')[0])
                gallery_img[idx] = v
            elif k.startswith('gallery_img') and k.endswith('[img_sm]'):
                idx = int(k.split('[')[1].split(']')[0])
                gallery_img_sm[idx] = v

        # 정렬
        gallery_img = [v for k, v in sorted(gallery_img.items())]
        gallery_img_sm = [v for k, v in sorted(gallery_img_sm.items())]

        print('main_img_file,',main_img_file)
        print('sub_img_file,',sub_img_file)
        print('gallery_img,',gallery_img)
        print('gallery_img_sm,',gallery_img_sm)
        # if 'main_img' in request.files:
        #   file = request.files['main_img']
        # print(f'{file.filename} uploaded successfully')

        json_data = request.form.get('json')
        if json_data:
            data = json.loads(json_data)
            print(data)
    response = jsonify({
        'message': 'Success'
    })
    response.status_code = 200
    return response

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


@app.route("/search_geocoding", methods=['GET', 'POST'])
def search_geocoding():
    if request.method == 'POST':
        address = request.get_json()
        lat_lon = geocoding(address);
        response = jsonify({
            'data' : lat_lon,
            'message': 'Success'
            })
        response.status_code = 200
        return response


@app.route("/home", methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return render_template('/home.html')


if __name__ == '__main__':
    app.run()
