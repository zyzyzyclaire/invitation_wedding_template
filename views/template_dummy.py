groom_dict = {
    "firstname":"지혁",
    "lastname":"강",
    "phoneNum" : "01000002222",
    
    "father":"강재만",
    "fatherFirstName":"재만",
    "fatherLastName":"강",
    "fatherPhoneNum" : "01011112222",
    "mother":"서미숙",
    "motherFirstName":"미숙",
    "motherLastName":"서",
    "motherPhoneNum" : "01033332222",
    "relation" : "아들",
}
bride_dict = {
    "firstname":"유라",
    "lastname":"최",
    "phoneNum" : "01000001111",
    "father":"최현상",
    "fatherFirstName":"현상",
    "fatherLastName":"최",
    "fatherPhoneNum" : "01011112222",
    "mother":"정선화",
    "motherFirstName":"선화",
    "motherLastName":"정",
    "motherPhoneNum" : "01033333333",
    "relation" : "딸",
}

bank_acc = [
    {
        "group_name" : "신랑측",
        "list" : [
            {
                "bank":"신한",
                "name":"강재만",
                "number":"123-456-789"
            },
            {
                "bank":"신한",
                "name":"강지혁",
                "number":"123-456-789"
            }
        ]
    },
    {
        "group_name" : "신부측",
        "list" : [
            {
                "bank":"신한",
                "name":"최현상",
                "number":"123-456-789"
            },
            {
                "bank":"신한",
                "name":"최유라",
                "number":"123-456-789"
            }
        ]
    },
]

wedding_schedule_dict = {
    'date' : "2023년 4월 5일",
    'date_format' : '2023-04-05',
    'time' : "토요일 오후 1시 30분",
    'time_hour' : "오후 1시",
    'time_minute' : "30분",
    'hall_detail' :  "아펠가모 광화문 B2 로스타뇨홀",  # db이름수정
    'hall_name' : "아펠가모 광화문",
    'hall_floor' : "B2 로스타뇨홀",
    'hall_addr' : "서울 종로구 종로1길 50",  #db이름수정
    'lat_lng' : [37.3595704, 127.105399]
}

transport_list = [
    {
        "title_transport":"버스",
        "contents_transport":'<div>뚝섬 서울숲 정류장<br>121, 141, 145, 148, 463<p></p>뜩삼약 8반 츨그 정류장<br>2016, 2224, 2413</div>',
    },
    {
        "title_transport":"지하철",
        "contents_transport":'<div>[분당선] <span class="c-bold">서울숲역</span> 5번 출구 도보 2분<br>[2호선] <span class="c-bold">뚝섬역</span> 8번 출구 도보 5분</div>',
    },
    {
        "title_transport":"자가용",
        "contents_transport":'<div>건물 내 B3-B7 <u>2시간</u> 무료주차<br>안내데스크에서 주차 등록</div>',
    },
]

message_templates_dict = {
    "main_message" : "\
        두 사람이 꽃과 나무처럼 걸어와서<br>\
        서로의 모든 것이 되기 위해<br>\
        오랜 기다림 끝에 혼례식을 치르는 날<br>\
        세상은 더욱 아름다워라<br><br>\
        이해인, <사랑의 사람들이여>\
    ",
    "sub_title" : "초대합니다",
    "sub_message" : "\
        <div>\
            살랑이는 바람결에<br>\
            사랑이 묻어나는 계절입니다.<br>\
            여기 곱고 예쁜 두 사람이 <span>사랑</span>을 맺어<br>\
            인생의 반려자가 되려 합니다.<br>\
            새 인생을 시작하는 이 자리에 오셔서<br>\
            <span>축복</span>해 주시면 감사하겠습니다.\
        </div>\
    ",
}

guestbook_list = [
    {
        "name":"김주리",
        "content_guestbook":"지혁씨 많이많이 축하합니다!! 함께 걸어가는 길에 꽃길만🌸🌼🌿",
        "created_at":"2021.08.08"
    },
    {
        "name":"박수림",
        "content_guestbook":"결혼 축하드려요🎉<br>이렇게 두 분의 결혼을 축하할 수 있어 너무 너무 기쁩니다!! 늘 건강하고 행복한 가정되시길 기도하고 응원할게요🌼",
        "created_at":"2021.08.08"
    },
    {
        "name":"윤지",
        "content_guestbook":"유라야💕 너무 이쁘다 러블리하구 봄바람에 흩날리는 민들레꽃씨같아! 행복행복기운이 뿜뿜한다! 평생 이쁘고 행복하게 잘살거같아 나는 걱정이 하나도 없어❣️축하해💝",
        "created_at":"2021.08.08"
    }
]
guestbook_password = {'password' : 'test'}

image_list = {
    "main_img" : "/static/images/users/testtest/main_img.jpg",
    "sub_img" : "/static/images/users/testtest/sub_img.jpg",
    "gallery_img" : [
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_001.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_001.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_002.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_002.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_003.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_003.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_004.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_004.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_005.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_005.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_006.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_006.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_007.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_007.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_008.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_008.jpg"
        },
        {
            "img": "/static/images/users/testtest/gallery_img/gallery_img_009.jpg",
            "img_sm" : "/static/images/users/testtest/gallery_img_sm/gallery_img_sm_009.jpg"
        },
    ]
}

