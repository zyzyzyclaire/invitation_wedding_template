const _imgContainer = document.querySelector('.img-container');
const _inputElement = document.querySelector('.img-container > input');
// const _img = document.querySelector('#drop-zone > img');
const _p = document.querySelector('.img-container > p')

_inputElement.addEventListener('change', function (e) {
    const fileList = _inputElement.files ;
    // 읽기
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    // 로드 한 후
    reader.onload = function  () {
        // _img.style = "display:block;";
        // _p.style = 'display: none';
        // 로컬 이미지를 보여주기 (원본)
        // document.querySelector('#preview').src = reader.result;
        
        // 썸네일 이미지 생성
        const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
        tempImage.onload = function() {
            const imgWidth = this.width;
            const imgHeight = this.height;
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
            canvasContext.drawImage(this, 0, cnavasImgY, canvasSize, canvasImgHeight);

            _imgContainer.appendChild(canvas);
            _imgContainer.classList.add('hasSrc');
            `<div class="btn-delete-img"><i class="ph-x-fill"></i></div>`

            // 캔버스에 그린 이미지를 다시 data-uri 형태로 변환
            // const dataURI = canvas.toDataURL("image/jpeg");
            
            // 썸네일 이미지 보여주기
            // _img.src = dataURI;

            // 썸네일 이미지를 다운로드할 수 있도록 링크 설정
            // document.querySelector('#download').href = dataURI;
        };
    }; 

})
_imgContainer.addEventListener('click', () => _inputElement.click());
