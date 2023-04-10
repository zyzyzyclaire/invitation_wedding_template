// fetch Api를 이용한 Post 요청 함수
const postApi = (url, data, successFun) => {
  fetch(url, {
    method: 'POST', // 요청 메서드
    // headers: {
    //   'Content-Type': 'application/json' // 요청 헤더 설정
    // },
    body: data // 요청 바디에 보낼 데이터
  })
  .then(response => response.json()) // 응답 데이터를 JSON으로 파싱
  .then(result => {
    // 성공적으로 응답 받았을 때 실행할 코드 작성
    successFun(result)
    // console.log(result);
  })
.catch(error => {
    // 요청이 실패했을 때 실행할 코드 작성
    console.error(error);
  });
}

// html 추가
const insertHTML = (element, dataDict) => {
  const __element = document.querySelectorAll(element);
  __element.forEach((_element)=>{
    const mainDataType = _element.getAttribute('data-type');
    const subDataType = _element.getAttribute(`${mainDataType}-type`);
    _element.innerHTML = dataDict[`${subDataType}_${mainDataType}`];
  })
}

