const __imgContainer = document.querySelectorAll('.img-container');
__imgContainer.forEach((_imgContainer)=>{
    const _inputElement = _imgContainer.querySelector('.img-container > input');
    const _p = _imgContainer.querySelector('.img-container > p');
    _inputElement.addEventListener('change', (e)=>{

        changeInputElement(_imgContainer, _inputElement, _p, e);

    });
});

// input type file의 value가 변했을 때
const changeInputElement = (_imgContainer, _inputElement, _p, e) => {
    const fileList = _inputElement.files ;
    console.log(_inputElement.files)
    if(fileList.length === 0 ) return;
    // 읽기
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    // 파일 로드가 완료된 후
    reader.onload = () =>  {
        // 썸네일 이미지 생성
        const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
        // 이미지 URL 로드가 완료된 후
        tempImage.onload = (e) => {
            const canvas = createCanvasTag(e);
            _imgContainer.appendChild(canvas);
            _imgContainer.classList.add('hasImg');

            const closeDiv = createDeleteBtnTag(e);
            _imgContainer.appendChild(closeDiv);
            addNewImgContainer();
        }
    }
}
// 이미지 닫기 버튼 태그 만들기
const createDeleteBtnTag = () => {
    const closeDiv = document.createElement('div');
    closeDiv.classList.add('btn-delete-img');
    closeDiv.onclick = (e) => clickDeleteImg('MAIN', e);
    closeDiv.innerHTML=`<i class="ph-x-fill"></i>`
    return closeDiv;
}
// 이미지 캔바스 태그 만들기
const createCanvasTag = (e) => {
    const imgWidth = e.target.width;
    const imgHeight = e.target.height;
    const canvasSize = 150;
    const canvasImgHeight = (imgHeight*canvasSize)/imgWidth;
    const cnavasImgY = (canvasSize-canvasImgHeight)/2;

    // 리사이즈를 위해 캔버스 객체 생성
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext("2d");
    
    // 캔버스 크기 설정
    canvas.width = canvasSize; // 가로 150px
    canvas.height = canvasSize; // 세로 150px

    // 이미지를 캔버스에 그리기
    canvasContext.drawImage(e.target, 0, cnavasImgY, canvasSize, canvasImgHeight);
    return canvas;
}

// 이미지 추가 컨텐츠 클릭
const clickAddImg = (target,e) => {
    console.log(target, e)
    // let currentTarget = e !== undefined ? e.target.target : target;
    if(target.classList.contains('hasImg')) return;
    target.querySelector('input').click();
}

// 이미지 삭제 버튼 클릭 시
const clickDeleteImg = (type, e) => {
    const _imgContainer = e.target.closest('.img-container')
    _imgContainer.classList.remove('hasImg');
    _imgContainer.querySelector('canvas').remove();
    _imgContainer.querySelector('.btn-delete-img').remove();
    e.stopPropagation();
}

// 이미지 컨테이너 추가
const addNewImgContainer = () => {
    const newImgContainer = `
        <div class="gallery-image img-container" onclick="clickAddImg(this);">
            <input type="file" accept="image/*" hidden="hidden">
            <p>클릭 후 업로드</p>
        </div>`;
    const lastImgContainer = document.querySelector('[name="gallery-info"] div .img-container:last-child');
    lastImgContainer.insertAdjacentHTML('afterend',newImgContainer);
}






// const _imgContainer = document.querySelector('.img-container');
// const _inputElement = document.querySelector('.img-container > input');
// // const _img = document.querySelector('#drop-zone > img');
// const _p = document.querySelector('.img-container > p')

// _inputElement.addEventListener('change', function (e) {
//     const fileList = _inputElement.files ;
//     if(fileList.length === 0 ) return;
//     // 읽기
//     const reader = new FileReader();
//     reader.readAsDataURL(fileList[0]);
//     // 로드 한 후
//     reader.onload = function  () {
//         // _img.style = "display:block;";
//         // _p.style = 'display: none';
//         // 로컬 이미지를 보여주기 (원본)
//         // document.querySelector('#preview').src = reader.result;
        
//         // 썸네일 이미지 생성
//         const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
//         tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
//         tempImage.onload = function() {
//             const imgWidth = this.width;
//             const imgHeight = this.height;
//             const canvasSize = 150;
//             const canvasImgHeight = (imgHeight*canvasSize)/imgWidth;
//             const cnavasImgY = (canvasSize-canvasImgHeight)/2;

//             // 리사이즈를 위해 캔버스 객체 생성
//             const canvas = document.createElement('canvas');
//             const canvasContext = canvas.getContext("2d");
            
//             // 캔버스 크기 설정
//             canvas.width = canvasSize; // 가로 150px
//             canvas.height = canvasSize; // 세로 150px

//             // 이미지를 캔버스에 그리기
//             canvasContext.drawImage(this, 0, cnavasImgY, canvasSize, canvasImgHeight);

//             _imgContainer.appendChild(canvas);
//             _imgContainer.classList.add('hasImg');
            
//             const closeDiv = document.createElement('div');
//             closeDiv.classList.add('btn-delete-img');
//             closeDiv.onclick = (e) => clickDeleteImg('MAIN', e);
            
//             closeDiv.innerHTML=`<i class="ph-x-fill"></i>`
//             _imgContainer.appendChild(closeDiv);
//             // `<div class="btn-delete-img"><i class="ph-x-fill"></i></div>`
            
//             // 캔버스에 그린 이미지를 다시 data-uri 형태로 변환
//             // const dataURI = canvas.toDataURL("image/jpeg");
            
//             // 썸네일 이미지 보여주기
//             // _img.src = dataURI;

//             // 썸네일 이미지를 다운로드할 수 있도록 링크 설정
//             // document.querySelector('#download').href = dataURI;
//         };
//     }; 

// });

// const clickDeleteImg = (type, e) => {
//     const _imgContainer = e.target.closest('.img-container')
//     _imgContainer.classList.remove('hasImg');
//     _imgContainer.querySelector('canvas').remove();
//     _imgContainer.querySelector('.btn-delete-img').remove();
//     e.stopPropagation();
// }
