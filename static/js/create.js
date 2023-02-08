const imgTypelist = ['main-image-info', 'gallery-info'];


// input type file의 value가 변했을 때
const changeInputImg = (target) => {
    const _imgContainer = target.closest('.img-container');
    const isMainImageInfo = target.closest('.image-info').getAttribute('name') === imgTypelist[0] ? true : false;
    const fileList = target.files ;
    if(fileList.length === 0 ) return;
    // 읽기
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    
    reader.onload = () =>  {
        // 썸네일 이미지 생성
        const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
        // 이미지 URL 로드가 완료된 후
        tempImage.onload = (e) => {
            const canvas = createCanvasTag(e);
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
        _imgContainer.querySelector('canvas').remove();
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
        </div>`;
    const lastImgContainer = document.querySelector('[name="gallery-info"] div .img-container:last-child');
    lastImgContainer.insertAdjacentHTML('afterend',newImgContainer);
}


