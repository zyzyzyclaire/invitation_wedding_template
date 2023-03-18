// 글귀 멘트 추가
insertHTML('[data-type="message"]', message_templates_dict);

// 교통 수단 추가
transport_list.forEach((transport, index)=>{
  insertHTML(`[data-type="transport"][data-index="${index}"]`, transport);
})

// 방명록 추가
guestbook_list.forEach((guestbook, index)=>{
  insertHTML(`[data-type="guestbook"][data-index="${index}"]`, guestbook);
})

const lat_lng = wedding_schedule_dict.lat_lng

const mapOptions = {
  center: new naver.maps.LatLng(lat_lng[0], lat_lng[1]), //지도의 초기 중심 좌표
  zoom: 16, //지도의 초기 줌 레벨
  minZoom: 7, //지도의 최소 줌 레벨
  zoomControl: false, //줌 컨트롤의 표시 여부
  zoomControlOptions: { //줌 컨트롤의 옵션
      position: naver.maps.Position.TOP_RIGHT
  }
};
const map = new naver.maps.Map('map', mapOptions);
new naver.maps.Marker({
  map: map,
  position: new naver.maps.LatLng(lat_lng[0], lat_lng[1])
})

// setOptions 메서드를 이용해 옵션을 조정할 수도 있습니다.
map.setOptions("mapTypeControl", false); // 지도 유형 컨트롤의 표시 여부
map.setOptions("scaleControl", false); // 지도 축척 컨트롤의 표시 여부입니다.
map.setOptions("mapDataControl", false); // 지도 데이터 저작권 컨트롤의 표시 여부입니다.




// 달력 시작

// 윤년 체크
function checkedLeapYear(year){
  if(year % 400 == 0) return true;
  else if(year % 100 == 0) return false;
  else if(year % 4 == 0) return true;
  else return false;
};

// 달의 시작일이 어떤 요일(몇 번째 위치)에서 시작하는지 계산
function getFirstDayOfWeek(year, month){
  if(month < 10) {
      month = "0" + month;
  };
  return (new Date(year + "-" + month + "-01" )).getDay();
};

// 월의 마지막 일자 계산
function changeYearMonth(year, month){
  let month_day = [31,28,31,30,31,30,31,31,30,31,30,31];
  if(month == 2) if(checkedLeapYear(year)) month_day[1] = 29;
  let first_day_of_week = getFirstDayOfWeek(year, month);
  let arr_calendar = [];
  for(let i=0; i<first_day_of_week; i++){
      arr_calendar.push('');
  };
  for(let i=1; i<=month_day[month-1]; i++){
      arr_calendar.push(String(i));
  };
  let remain_day = 7 - (arr_calendar.length % 7);
  if(remain_day < 7){
      for(let i=0; i<remain_day; i++){
          arr_calendar.push('');
      };
  };
  renderCalendar(arr_calendar)

};

function renderCalendar(data){
  let h = [];
  for(let i=0; i<data.length; i++){
      if(i==0){
          h.push('<tr>');
      }else if(i % 7 == 0){
          h.push('</tr>')
          h.push('<tr>');
      };
      h.push(`<td onclick="setDate(${data[i]})"; style="cursor:pointer;">
          <div id="calendar_${current_year}_${current_month}_${data[i]}" style="position: relative;">
              ${data[i]}
          </div>
      </td>`);
  }
  h.push('</tr>');
  document.getElementById('tb_body').innerHTML = h.join('')
  // $("#tb_body").html(h.join(''));
}

function setDate(day){
  // document.querySelector('.current_day').classList.remove('current_day')
  let target_date = `calendar_${current_year}_${current_month}_${day}`
  document.getElementById(`${target_date}`).classList.add('current_day')
  // const el = document.querySelector('#parse_emotion_view');
  // const sheet = el.sheet;
  // const rules = sheet.cssRules;
  // const rule = rules[0];
  // sheet.insertRule('.current_day::after{content: "'+ day +'"; position: absolute; line-height: 29px; top: -1.5px; bottom: 0; margin: 0 auto; width: 32px; height: 32px; background: #FFE3DF; left: 0; border-radius: 50%;}', rules.length)
  // if(day<10){
  //     day = "0" + day;
  // }
  // console.log(current_year, current_month, day)

}

function changeMonth(diff) {
  current_month = current_month + diff;
  if(current_month == 0){
      current_year = current_year - 1;
      current_month = 12;
  }else if(current_month === 13){
      current_year = current_year + 1;
      current_month = 1;
  }
  loadCalendar(current_year, current_month)
}

function loadCalendar(year, month){
  changeYearMonth(year, month);
  document.getElementById('current_date').innerText = `${year}년  ${month}월`
  // $("#current_date").text(`${year}년  ${month}월`)
  console.log(this_year, year, this_month, month)
  if(this_year === year && this_month === month){
      setDate(this_date)
  }
  
}

let current_year = (new Date()).getFullYear();
let current_month = (new Date()).getMonth() + 1;
let current_date = (new Date()).getDate();

let this_year = (new Date()).getFullYear();
let this_month = (new Date()).getMonth() + 1;
let this_date = (new Date()).getDate();

loadCalendar(current_year, current_month)
setDate((new Date()).getDate())
// 달력 만들기 끝

// 오늘 날짜 LNB에 추가하기
// document.getElementById('current_date_tag').innerText = `${current_year}-${current_month}-${current_date}`
// 달력 끝
