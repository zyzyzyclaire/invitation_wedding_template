const imgTypelist = ['main-image-info', 'gallery-info', 'phrase-info'];


// input type file의 value가 변했을 때
const changeInputImg = (target) => {
    const fileList = target.files ;
    if(fileList.length === 0 ) return;

    const _imgContainer = target.closest('.img-container');
    const targetName = target.closest('.image-info').getAttribute('name');
    const isMainImageInfo = targetName === imgTypelist[0] || targetName === imgTypelist[2] ? true : false;
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
    if(type === imgTypelist[0] || type === imgTypelist[2]){
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
    <div class="crop-modal modal">
        <!-- 모달 콘텐츠 -->
        <div class="modal-content">
            <div class="modal-top">
                <h1>썸네일 편집</h1>
                <button class="btn-close-modal"><i class="ph-x-bold i-close-modal"></i></button>
            </div>
            <div class="crop-modal-content modal-middle">
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
    document.querySelector('.crop-modal').addEventListener('click',(e)=>{clickDeleteCropModal(e)});
    document.querySelector('.btn-close-modal').addEventListener('click',(e)=>{clickDeleteCropModal(e)});
    const image = document.querySelector('.crop-modal-content img');
    createNewCropper(image)
    
}

// 크랍 모달 HTML 삭제
const clickDeleteCropModal = (e) => {
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


// 샘플 문구 모달 생성
const openSamplePhrasesModal = (e) => {
    e.preventDefault();

    const samplePhrase = [
        `새로운 마음과 새 의미를 간직하며
        저희 두 사람이 새 출발의 첫 걸음을 내딛습니다.
        좋은 꿈, 바른 뜻으로 올바르게 살 수 있도록
        축복과 격려주시면
        더없는 기쁨으로 간직하겠습니다.`,

        `두 사람이 사랑으로 만나
        진실과 이해로써 하나를 이루려 합니다.
        이 두 사람을 지성으로 아끼고 돌봐주신
        여러 어른과 친지를 모시고 서약을 맺고자 하오니
        바쁘신 가운데 두 사람의 장래를
        가까이에서 축복해 주시면 고맙겠습니다.`,

        `다른 공간, 다른 시간을 걷던 두 사람이
        서로를 마주한 이후
        같은 공간, 같은 시간을 꿈꾸며
        걷게 되었습니다.
        소박하지만 단단하고 따뜻한
        믿음의 가정을 이뤄가겠습니다.
        오셔서 첫 날의 기쁨과 설렘을
        함께 해 주시고 축복해 주세요.`,

        `모든 것이 새로워지는 봄날,
        사랑하는 두 사람이 새 인생을 시작하려 합니다.
        바쁘시더라도 와주셔서 두 사람의 결혼을 축복해 주시고
        따뜻한 마음으로 격려해 주신다면
        큰 힘이 되겠습니다.`,

        `살랑이는 바람결에
        사랑이 묻어나는 계절입니다.
        여기 곱고 예쁜 두 사람이 사랑을 맺어
        인생의 반려자가 되려 합니다.
        새 인생을 시작하는 이 자리에 오셔서
        축복해 주시면 감사하겠습니다.`,

        `같은 생각, 같은 마음으로 지혜롭게 살겠습니다.
        저희 두 사람이 소중한 분들을 모시고
        사랑의 결실을 이루려 합니다.
        오로지 믿음과 사랑만을 약속하는 귀한 날에
        축복의 걸음을 하시어 저희의 하나 됨을
        지켜보아 주시고 격려해 주시면
        더없는 기쁨으로 간직하겠습니다.`,

        `평생을 같이하고 싶은 사람을 만났습니다.
        서로 아껴주고 이해하며 사랑을 베풀며 살고 싶습니다.
        저희 약속 위에 따뜻한 격려로 축복해 주셔서
        힘찬 출발의 디딤이 되어 주십시오.`,

        `진실과 이해로써 만난 두 사람이
        사랑으로써 하나를 이루려 합니다.
        그동안 이 두 사람을 지성으로 보살펴 주신
        여러 어른과 친지를 모시고 하나되는 서약을 맺고자 하오니
        바쁘신 가운데 찾아주시어 두 사람의 미래를
        가까이에서 축복해 주시면 감사하겠습니다.`,

        `부족하지 않되 지나치지 말라는 말씀
        마음속 깊이 간직하고 있습니다.
        오늘 저희 두 사람
        평소 존경해온 어른, 친지분들 앞에서
        백년의 서약을 하려고 합니다.
        부디 참석해 주셔서
        앞으로도 삶의 참 의미를 깨달아 가도록
        축복해 주시기 바랍니다.`,

        `어제의 너와 내가 오늘의 우리가 되어
        저희 두 사람 이제 한길을 같이 걷고자 합니다.
        저희가 내딛는 첫 걸음에 부디 오셔서
        따뜻한 사랑으로 축복해 주십시오.`
    ];

    let modalHtml = `
    <div class="sample-phrase-modal modal">
        <div class="modal-content">
            <div class="modal-top">
                <h1>샘플 문구</h1>
                <button class="btn-close-modal">
                    <i class="ph-x-bold i-close-modal"></i>
                </button>
            </div>
            <div class="modal-middle">
                <div>`
                
    samplePhrase.forEach((phrase)=>{
        modalHtml += `<div class="phrase-container" onclick="addSampleRhrase(this)">${phrase.replace(/\n/g, '<br/>')}</div>`            
    })
    
    modalHtml += `</div>
            </div>
        </div>
    </div>`
    document.querySelector('.container').insertAdjacentHTML('afterend', modalHtml)
    document.querySelector('.sample-phrase-modal').addEventListener('click',(e)=>{clickDeleteSamplePhraseModal(e)});
    document.querySelector('.btn-close-modal').addEventListener('click',(e)=>{clickDeleteSamplePhraseModal(e)});
}

// 샘플 문구 모달 HTML 삭제
const clickDeleteSamplePhraseModal = (e) => {
    const isCropModal = e.target == document.querySelector('.sample-phrase-modal') ? true : false;
    const isBtnCloseModal = e.target == document.querySelector('.btn-close-modal') ? true : false;
    const isICloseModal = e.target == document.querySelector('.i-close-modal') ? true : false;
    if(!isCropModal && !isBtnCloseModal && !isICloseModal) return;
    // document.querySelector('.sample-phrase-modal').removeEventListener('click', clickDeleteImg)
    document.querySelector('.sample-phrase-modal').remove();
}

// 샘플 문구를 클릭했을 때 textarea에 해당 문구를 추가한다.
const addSampleRhrase = (target) => {
    const newText = target.innerHTML.replace(/<br>/g, "\n").trim().split('\n').map(line => line.trimLeft()).join('\n');
    document.querySelector('[name="phrase-info"] textarea').value = newText
    document.querySelector('.sample-phrase-modal').remove();
}

document.querySelector('.btn-show-sample-phrase').addEventListener('click',(e)=>{openSamplePhrasesModal(e)})

// 예약일 기본 값 오늘로 지정
document.querySelector('[name="reservation-info"] [type="date"]').value = new Date().toISOString().substring(0, 10);;


const _gallery = document.querySelector('form[name="gallery-info"] div')
let sortable = Sortable.create(_gallery);

const openPostCode = (str=null) => {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            console.log(data)
        }
    }).open({
        q: str,
    });

}
const createMapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), //지도의 초기 중심 좌표
    zoom: 16, //지도의 초기 줌 레벨
    minZoom: 7, //지도의 최소 줌 레벨
    zoomControl: false, //줌 컨트롤의 표시 여부
    zoomControlOptions: { //줌 컨트롤의 옵션
        position: naver.maps.Position.TOP_RIGHT
    }
};
const createMap = new naver.maps.Map('createMap', createMapOptions);
new naver.maps.Marker({
    map: createMap,
    position: new naver.maps.LatLng(37.3595704, 127.105399)
})


// setOptions 메서드를 이용해 옵션을 조정할 수도 있습니다.
// map.setOptions("mapTypeControl", false); // 지도 유형 컨트롤의 표시 여부
// map.setOptions("scaleControl", false); // 지도 축척 컨트롤의 표시 여부입니다.
// map.setOptions("mapDataControl", false); // 지도 데이터 저작권 컨트롤의 표시 여부입니다.

// 주소 input 태그에서 엔터 입력 시 openPostCode 실행
const inputElement = document.querySelector("[name='wedding-place addr']");
inputElement.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        openPostCode(inputElement.value)
    }
});


// 클라이언트 ID와 클라이언트 시크릿을 입력합니다.
const clientId = "ko0r34e7m9";
const clientSecret = "prCzt8XuwLxK0WlPW8QxqyDQHVhWnZkywBSlrlDA";

// 입력한 주소를 네이버 지오코딩 API에 전달하여 좌표 값을 받아옵니다.
async function getCoordinate(address) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURI(address)}`;
  const response = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
    },
  });
  const data = await response.json();
  if (data.meta.count > 0) {
    const [x, y] = data.addresses[0];
    return { lat: y, lon: x };
  }
  return null;
}

// 주소를 입력받아 좌표 값을 출력합니다.
const address = prompt("주소를 입력하세요:");
getCoordinate(address).then((coordinate) => {
  if (coordinate) {
    console.log(`입력한 주소의 좌표 값은 (${coordinate.lat}, ${coordinate.lon})입니다.`);
  } else {
    console.log("주소를 다시 확인해주세요.");
  }
});
