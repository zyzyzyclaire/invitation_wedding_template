const imgTypelist = ['main-image-info', 'gallery-info'];


// input type file의 value가 변했을 때
const changeInputImg = (target) => {
    const fileList = target.files ;
    if(fileList.length === 0 ) return;

    const _imgContainer = target.closest('.img-container');
    const isMainImageInfo = target.closest('.image-info').getAttribute('name') === imgTypelist[0] ? true : false;
    const _canvas = _imgContainer.querySelector('canvas');
    console.log(_canvas)
    // 읽기
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    
    reader.onload = () =>  {
        // 썸네일 이미지 생성
        const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
        // 이미지 URL 로드가 완료된 후
        tempImage.onload = (e) => {
            const canvas = createCanvasTag(_canvas, e);
            _imgContainer.appendChild(canvas);
            _imgContainer.classList.add('hasImg');

            const closeDiv = `<div class="btn-delete-img"><i class="ph-x-fill"></i></div>`
            _imgContainer.insertAdjacentHTML('beforeend',closeDiv);
            _imgContainer.querySelector('.btn-delete-img').addEventListener('click',(e)=>clickDeleteImg(e))
            if(isMainImageInfo) return;
            addNewImgContainer();

        }
    }
}

// 이미지 캔바스 태그 만들기
const createCanvasTag = (canvas, e) => {
    const imgWidth = e.target.width;
    const imgHeight = e.target.height;
    const canvasSize = 300;
    const canvasImgHeight = (imgHeight*canvasSize)/imgWidth;
    const cnavasImgY = (canvasSize-canvasImgHeight)/2;
    // 리사이즈를 위해 캔버스 객체 생성
    // const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext("2d");
    
    // 캔버스 크기 설정
    // canvas.width = canvasSize; // 가로 150px
    // canvas.height = canvasSize; // 세로 150px

    // 이미지를 캔버스에 그리기
    canvasContext.drawImage(e.target, 0, cnavasImgY, canvasSize, canvasImgHeight);
    return canvas;
}

// 이미지 추가 컨텐츠 클릭
const clickAddImg = (target) => {
    if(target.classList.contains('hasImg')) return;
    target.querySelector('input').click();
}

// 이미지 삭제 버튼 클릭 시
const clickDeleteImg = (e) => {
    e.stopPropagation();    
    const _imgContainer = e.target.closest('.img-container')
    const _imgInfo = e.target.closest('.image-info');
    const type = _imgInfo.getAttribute('name');
    if(type === imgTypelist[0]){
        _imgContainer.classList.remove('hasImg');
        const canvas = _imgContainer.querySelector('canvas')
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        _imgContainer.querySelector('.btn-delete-img').remove();
        _imgContainer.querySelector('input').value = '';
        return
    }
    if(type === imgTypelist[1]){
        _imgContainer.removeEventListener('click', clickDeleteImg)
        _imgContainer.remove();
        return
    }
}

// 이미지 컨테이너 추가
const addNewImgContainer = () => {
    const newImgContainer = `
        <div class="gallery-image img-container" onclick="clickAddImg(this);">
            <input type="file" accept="image/*" hidden="hidden" onchange="changeInputImg(this)">
            <p>클릭 후 업로드</p>
            <canvas width="300" height="300"></canvas>
        </div>`;
    const lastImgContainer = document.querySelector('[name="gallery-info"] div .img-container:last-child');
    lastImgContainer.insertAdjacentHTML('afterend',newImgContainer);
}

// 이미지 크롭 모달 열기
const openCropModar = () => {
    const modalHtml = `
    <!-- 모달 -->
    <div class="crop-modal">
        <!-- 모달 콘텐츠 -->
        <div class="modal-content">
            <div class="crop-modal-top">
                <h1>썸네일 편집</h1>
                <button class="btn-close-modal"><i class="ph-x-bold"></i></button>
            </div>
            <div class="crop-modal-content">
                <img src="/static/images/wedding_img/gallery_img/gallery_img_origin_003.jpg" alt="">
            </div>
            <div class="crop-modal-bottom">
                <button>
                    <i class="ph-check-bold"></i>
                    <div>적용</div>
                </button>
            </div>
        </div>
    </div>`;
}


const _cropModal = document.querySelector('.crop-modal');
const _btnOpenModal = document.querySelector('.btn-open-modal');
const _btnCloseModal = document.querySelector('.btn-close-modal');

// 사용자가 버튼을 클릭하면 모달을 엽니다.
_btnOpenModal.onclick = function() {
    _cropModal.style.display = "block";
}

// 사용자가 모달 외부 아무 곳이나 클릭하면 닫습니다.
window.onclick = function(event) {
  if (event.target == _cropModal || event.target == _btnCloseModal) {
    _cropModal.style.display = "none";
  }
}