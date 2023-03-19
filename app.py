from flask import Flask, render_template, request, jsonify
from models import session_scope, User
from views.template.index import geocoding

app = Flask(__name__)

@app.route("/")
def index():
    with session_scope() as session:
        test = session.query(User).filter(User.id == 1).first()
        name = test.name
        # 더미 존
        from views.template.template_dummy import groom_dict, bride_dict, wedding_schedule_dict, message_templates_dict, transport_list, guestbook_list, image_list
        groom_dict = groom_dict # 신랑 데이터
        bride_dict = bride_dict # 신부 데이터
        wedding_schedule_dict = wedding_schedule_dict # 장소와 시간 데이터
        message_templates_dict = message_templates_dict # 글귀 데이터
        transport_list = transport_list # 교통 수단 데이터
        guestbook_list = guestbook_list # 방명록 데이터
        image_list = image_list # 이미지 데이터
        print(geocoding("부산시 연제구 거제대로 198"))
    return render_template('/index.html',  
                           groom_dict=groom_dict, 
                           bride_dict=bride_dict,
                           wedding_schedule_dict=wedding_schedule_dict,
                           message_templates_dict=message_templates_dict,
                           transport_list=transport_list,
                           guestbook_list=guestbook_list,
                           image_list=image_list
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
    return render_template('/create.html')

if __name__ == '__main__':
    app.run()
