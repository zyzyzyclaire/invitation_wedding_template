
const postApi = (url, data, callbackFun) => {
  fetch(url, {
    method: 'POST', // 요청 메서드
    headers: {
      'Content-Type': 'application/json' // 요청 헤더 설정
    },
    body: JSON.stringify(data) // 요청 바디에 보낼 데이터
  })
  .then(response => response.json()) // 응답 데이터를 JSON으로 파싱
  .then(result => {
    // 성공적으로 응답 받았을 때 실행할 코드 작성
    callbackFun(result)
    // console.log(result);
  })
.catch(error => {
    // 요청이 실패했을 때 실행할 코드 작성
    console.error(error);
  });
}