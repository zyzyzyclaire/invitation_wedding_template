const imgTypelist = ['main-image-info', 'gallery-info'];


// input type file의 value가 변했을 때
const changeInputImg = (target) => {
    const fileList = target.files ;
    if(fileList.length === 0 ) return;

    const _imgContainer = target.closest('.img-container');
    const isMainImageInfo = target.closest('.image-info').getAttribute('name') === imgTypelist[0] ? true : false;
    const _canvas = _imgContainer.querySelector('canvas');
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
            const EditButton = `<button class="btn-open-modal">썸네일 편집</button>`
            _imgContainer.insertAdjacentHTML('beforeend',EditButton);
            _imgContainer.querySelector('.btn-open-modal').addEventListener('click',(e)=>openCropModar(reader.result, e))
            addNewImgContainer();

        }
    }
}

// 이미지 캔바스 태그 만들기
const createCanvasTag = (canvas, e) => {
    const canvasContext = canvas.getContext("2d");
    const imgWidth = e.target.width;
    const imgHeight = e.target.height;
    const canvasSize = 300;
    if(imgWidth > imgHeight) {
        const canvasImgHeight = (imgHeight*canvasSize)/imgWidth;
        const cnavasImgY = (canvasSize-canvasImgHeight)/2;
        // 이미지를 캔버스에 그리기
        canvasContext.drawImage(e.target, 0, cnavasImgY, canvasSize, canvasImgHeight);
    }else{
        const canvasImgWidth = (imgWidth*canvasSize)/imgHeight;
        const cnavasImgX =  (canvasSize-canvasImgWidth)/2;
        canvasContext.drawImage(e.target, cnavasImgX, 0, canvasImgWidth, canvasSize);
    }   
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

// 이미지 크롭 모달 생성
const openCropModar = (src, e) => {
    e.preventDefault();
    const modalHtml = `
    <div class="crop-modal">
        <!-- 모달 콘텐츠 -->
        <div class="modal-content">
            <div class="crop-modal-top">
                <h1>썸네일 편집</h1>
                <button class="btn-close-modal"><i class="ph-x-bold i-close-modal"></i></button>
            </div>
            <div class="crop-modal-content">
                <div>
                    <img src="${src}" alt="">
                </div>
            </div>
            <div class="crop-modal-bottom">
                <button onclick="clickSaveCropImage()">
                    <i class="ph-check-bold"></i>
                    <div>적용</div>
                </button>
            </div>
        </div>
    </div>`;
    document.querySelector('.container').insertAdjacentHTML('afterend', modalHtml)
    document.querySelector('.crop-modal').addEventListener('click',(e)=>{clickDeleteModal(e)});
    document.querySelector('.btn-close-modal').addEventListener('click',(e)=>{clickDeleteModal(e)});
    const image = document.querySelector('.crop-modal-content img');
    createNewCropper(image)
    
}

// 크랍 모달 HTML 삭제
const clickDeleteModal = (e) => {
    const isCropModal = e.target == document.querySelector('.crop-modal') ? true : false;
    const isBtnCloseModal = e.target == document.querySelector('.btn-close-modal') ? true : false;
    const isICloseModal = e.target == document.querySelector('.i-close-modal') ? true : false;
    if(!isCropModal && !isBtnCloseModal && !isICloseModal) return;
    document.querySelector('.crop-modal').removeEventListener('click', clickDeleteImg)
    document.querySelector('.crop-modal').remove();
}
// 크롭퍼 객체 생성
function createNewCropper (img) {
    window.cropper = new Cropper(img, {
        toggleDragModeOnDblclick: false,
        dragMode: 'none',
        zoomable: false,
        autoCropArea:1,
        aspectRatio: 1 / 1,
    });
};

// 크롭 모달에서 적용 버튼 클릭 시
const clickSaveCropImage = () => {
    const cropper = window.cropper;
    cropper.getCroppedCanvas({
        width: 300,
        height: 300,
    }).toBlob((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            const img = new Image();
            img.src = reader.result;
            document.querySelector('form[name="cropper-info"] div').appendChild(img)
        };
    }, 'image/png' );
    
};











