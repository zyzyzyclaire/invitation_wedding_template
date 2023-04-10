const imgTypelist = ['main-image-info', 'gallery-info', 'phrase-info'];


// input type file의 value가 변했을 때
const changeInputImg = (target) => {
    const fileList = target.files ;    
    if(fileList.length === 0 ) return;
    const _imgContainer = target.closest('.img-container');
    const targetName = target.closest('.image-info').getAttribute('name');
    const isMainImageInfo = targetName === imgTypelist[0] || targetName === imgTypelist[2] ? true : false;
    const _canvas = _imgContainer.querySelector('canvas');
    const originImg = _imgContainer.querySelector('.origin-img');
    const _cropImg = _imgContainer.querySelector('.crop-img');

    // 읽기
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    reader.onload = () =>  {
        
        originImg.src = reader.result // origin img 넣기
        originImg.setAttribute('data-type','gallery_img')
        originImg.setAttribute('data-name','img')

        const tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
        // 썸네일 이미지 생성
        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
        
        // 이미지 URL 로드가 완료된 후
        tempImage.onload = (e) => {
            const canvas = createCanvasTag(_canvas, e.target);
            setHasImg(_imgContainer, canvas)

            if(isMainImageInfo) return;
            // 초기 크롭이미지 생성을 위한 서브 이미지 태그 생성
            _cropImg.setAttribute('data-type', 'gallery_img')
            _cropImg.setAttribute('data-name', 'img_sm')
            const subImg = document.querySelector('#subImg');
            subImg.appendChild(tempImage);
            const image = document.querySelector('#subImg img');
            // 초기 이미지 태그 생성
            const cropper = new Cropper(image, {
                autoCropArea:1,
                aspectRatio: 1 / 1,
                crop: function (event) {
                    const croppedImage = cropper.getCroppedCanvas();
                    const croppedImageDataUrl = croppedImage.toDataURL();
                    _cropImg.src = croppedImageDataUrl
                }
            });
            subImg.innerHTML = ''
            setGalleryHasImg(_imgContainer, reader.result)
            addNewImgContainer();
        }
    }    
}

// 이미지 추가 시 html 세팅
const setHasImg = (_imgContainer, canvas) => {
    const closeDiv = `<div class="btn-delete-img"><i class="ph-x-fill"></i></div>`
    _imgContainer.classList.add('hasImg');
    _imgContainer.appendChild(canvas);
    _imgContainer.insertAdjacentHTML('beforeend',closeDiv);
    _imgContainer.querySelector('.btn-delete-img').addEventListener('click',(e)=>clickDeleteImg(e))
}
// 갤러리 이미지 추가 시 html 세팅
const setGalleryHasImg = (_imgContainer, src) => {
    const EditButton = `<button class="btn-open-modal">썸네일 편집</button>`
    _imgContainer.insertAdjacentHTML('beforeend',EditButton);
    _imgContainer.querySelector('.btn-open-modal').addEventListener('click',(e)=>{
        openCropModar(src, e, _imgContainer)
    })
    
}

// 이미지 캔바스 태그 만들기
const createCanvasTag = (canvas, img) => {
    const canvasContext = canvas.getContext("2d");
    const imgWidth = img.width;
    const imgHeight = img.height;
    canvasContext.clearRect(0, 0, 300, 300);
    const canvasSize = 300;
    if(imgWidth > imgHeight) {
        const canvasImgHeight = (imgHeight*canvasSize)/imgWidth;
        const cnavasImgY = (canvasSize-canvasImgHeight)/2;
        // 이미지를 캔버스에 그리기
        canvasContext.drawImage(img, 0, cnavasImgY, canvasSize, canvasImgHeight);
    }else{
        const canvasImgWidth = (imgWidth*canvasSize)/imgHeight;
        const cnavasImgX =  (canvasSize-canvasImgWidth)/2;
        canvasContext.drawImage(img, cnavasImgX, 0, canvasImgWidth, canvasSize);
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
            <input type="file" accept="image/*" hidden="hidden" onchange="changeInputImg(this);">
            <p>클릭 후 업로드</p>
            <canvas width="300" height="300"></canvas>
            <img class="origin-img" src="" alt="">
            <img class="crop-img" src="" alt="">
        </div>`;
    const lastImgContainer = [...document.querySelectorAll('[name="gallery-info"] div .img-container')].pop();
    
    lastImgContainer.insertAdjacentHTML('afterend',newImgContainer);
    // setGalleryInputIndex();
}

// 이미지 크롭 모달 생성
const openCropModar = (src, e, _imgContent) => {
    e.preventDefault();
    _imgContent.setAttribute('data-crop', 'active')
    
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
    const _inputSm = _imgContent.querySelector('.hasCropBoxData');
    if(!_inputSm) return createNewCropper(image);
    const positionList = ['left', 'top', 'width', 'height']
    const cropBoxPosition = new Object;
    positionList.forEach((position)=>{
        cropBoxPosition[`${position}`] = getCropBoxPostion(_inputSm,position)
    })
    createNewCropper(image, cropBoxPosition)
}
// html 속성에 담긴 position 데이터 빼내기
const getCropBoxPostion = (html, type) => {
    const strData = html.getAttribute(`data-${type}`);
    const data = Math.floor(parseFloat(strData))
    return data
}

// 크랍 모달 닫기 클릭 영역 확인
const clickDeleteCropModal = (e) => {
    const isCropModal = e.target == document.querySelector('.crop-modal') ? true : false;
    const isBtnCloseModal = e.target == document.querySelector('.btn-close-modal') ? true : false;
    const isICloseModal = e.target == document.querySelector('.i-close-modal') ? true : false;
    if(!isCropModal && !isBtnCloseModal && !isICloseModal) return;
    DeleteCropModal();
}
// 크랍 모달 HTML 삭제 
const DeleteCropModal = () => {
    document.querySelector('.crop-modal').removeEventListener('click', clickDeleteImg)
    document.querySelector('.crop-modal').remove();
    const _imgContent = document.querySelector('[data-crop="active"]')
    _imgContent.setAttribute('data-crop', '');
}
// 크롭퍼 객체 생성
function createNewCropper (img, position) {
    window.cropper = new Cropper(img, {
        toggleDragModeOnDblclick: false,
        dragMode: 'none',
        viewMode: 2, // crop box 가 img를 넘어가지 않게 함
        zoomable: false,
        autoCropArea:1,
        aspectRatio: 1 / 1,
        checkOrientation: false, // 자동 회전 방지
    });
    if(!position) return
    cropper.setCropBoxData(position)
};


// 크롭 모달에서 적용 버튼 클릭 시
const clickSaveCropImage = () => {
    const _imgContent = document.querySelector('[data-crop="active"]')
    let _canvas = _imgContent.querySelector('canvas')

    let _inputSm = _imgContent.querySelector('[data-name="img_sm"]')
    const _cropImg = _imgContent.querySelector('.crop-img');
    const cropper = window.cropper;
    const cropBoxData = cropper.getCropBoxData();
    _inputSm.classList.add('hasCropBoxData');
    cropper.getCroppedCanvas({
        width: 300,
        height: 300,
    }).toBlob((blob) => {
        // const file = new File([blob], 'image.png', { type: 'image/png' });
        // console.log(file)

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            const img = new Image();
            _cropImg.src = reader.result;
            img.src = reader.result;
            img.onload = (e) => {
                const canvas = createCanvasTag(_canvas, e.target);
                _canvas = canvas
                
                _inputSm.setAttribute('data-top', cropBoxData.top)
                _inputSm.setAttribute('data-left', cropBoxData.left)
                _inputSm.setAttribute('data-width', cropBoxData.width)
                _inputSm.setAttribute('data-height', cropBoxData.height)
            }
            // _cropImg.innerHTML = '';
            // _cropImg.appendChild(img);
        };
    }, 'image/png' );
    DeleteCropModal();
};

// 이미지를 가지고 있는 img-container에 index 정리하기
// const setGalleryInputIndex = () => {
//     const __imgContainer = document.querySelectorAll('.img-container.hasImg');
//     if(__imgContainer.length == 0) return 
//     __imgContainer.forEach((_imgContainer, index)=>{
//         _imgContainer.setAttribute('data-index', index);
//     })
// }


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
    const newText = target.innerHTML
    var editor = tinymce.get('phrase_textarea');
    editor.setContent(newText);
    document.querySelector('.sample-phrase-modal').remove();
}

document.querySelector('.btn-show-sample-phrase').addEventListener('click',(e)=>{openSamplePhrasesModal(e)})

// 예약일 기본 값 오늘로 지정
if(document.querySelector('[name="reservation-info"] [type="date"]').value == ''){
    document.querySelector('[name="reservation-info"] [type="date"]').value = new Date().toISOString().substring(0, 10);;
}


const _gallery = document.querySelector('form[name="gallery-info"] div')
let sortable = Sortable.create(_gallery,{
    draggable: '.hasImg'
});

const openPostCode = (str=null) => {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            postApi('search_geocoding', JSON.stringify(data.address), setMarkerPosition)
            // search_geocoding

        }
    }).open({
        q: str,
    });
}

// 위도 경도 좌표 찍기
const lat_lng = wedding_schedule_dict.lat_lng

const createMapOptions = {
    center: new naver.maps.LatLng(lat_lng[0], lat_lng[1]), //지도의 초기 중심 좌표
    zoom: 16, //지도의 초기 줌 레벨
    minZoom: 7, //지도의 최소 줌 레벨
    zoomControl: false, //줌 컨트롤의 표시 여부
    zoomControlOptions: { //줌 컨트롤의 옵션
        position: naver.maps.Position.TOP_RIGHT
    }
};
const createMap = new naver.maps.Map('createMap', createMapOptions);
const createMarker = new naver.maps.Marker({
    map: createMap,
    position: new naver.maps.LatLng(lat_lng[0], lat_lng[1])
})

function setMarkerPosition(data) {
    const lat = data.data[0];
    const lng = data.data[1];
    let newLatLng = new naver.maps.LatLng(lat, lng);
    createMarker.setPosition(newLatLng);
    createMap.setCenter(newLatLng);
}

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

// 계좌번호 HTML 추가
const addbankDataHtml = (event, index) => {
    event.preventDefault();
    const _buttons = document.querySelector(`.bank-data-buttons-${index}`)
    let html = `
        <div class="other bank-number-${index}">
            <h4>계좌번호</h4>
            <div class="account-data">
                <input type="text" placeholder="은행" value="">
                <input type="text" placeholder="계좌번호" value="">
            </div>
        </div>
        <div class="other bank-name-${index}">
            <h4>예금주</h4>
            <input type="text" value="">
        </div>
        <br class="other bank-br-tag-${index}">
    `
    _buttons.insertAdjacentHTML('beforebegin', html)
}
// 계좌번호 HTML 삭제
const deletebankDataHtml = (event, index) => {
    event.preventDefault();
    const inputList = ['number', 'name', 'br-tag']
    let bankLength = 0;    
    inputList.forEach((type)=>{
        const __bank = document.querySelectorAll(`[name="account-number-info"] .other.bank-${type}-${index}`);    
        bankLength = __bank.length;    
        const _bank = __bank[bankLength-1];
        if(bankLength>0) _bank.remove();
    })
    if(bankLength === 0) return alert('계좌정보는 그룹 당 최소 한 개 이상 작성해 주세요.')
}

// 계좌 정보 받아오기
const getBankData = () => {
    const __bankAcc = document.querySelectorAll('[data-type="bank_acc"]');
    const arr = [];
    let obj = {};
    let listObj = {};
    __bankAcc.forEach((_bankAcc)=>{
        const dataName = _bankAcc.getAttribute('data-name');
        if(dataName == 'group_name'){
            if(obj['groupName']){
                obj['list'].push(listObj)
                listObj = {};
                arr.push(obj)
                obj = {};
            }
            obj['groupName'] = _bankAcc.value;
            obj['list'] = [];
        }
        if(dataName == 'list'){
            const listType = _bankAcc.getAttribute('list-type');
            if(listObj[listType]){
                obj['list'].push(listObj)
                listObj = {};
            }
            listObj[listType] = _bankAcc.value
        }
    })
    obj['list'].push(listObj)
    arr.push(obj)
    return arr;
}
// 이미지 받아오기
const getImgData = () =>{
    const _mainImg = document.querySelectorAll('[data-name="main_img"]');
    const _subImg = document.querySelectorAll('[data-name="sub_img"]');
    const __mainSubImgList = [... _mainImg, ..._subImg]
    const __galleryImgList = document.querySelectorAll('[data-type="gallery_img"][data-name="img"]') 
    const __gallerySmImgList = document.querySelectorAll('[data-type="gallery_img"][data-name="img_sm"]') 
    
    const formData = new FormData();
    __mainSubImgList.forEach((_imgList)=>{
        const key = _imgList.getAttribute('data-name');
        const _imgContainer = _imgList.closest('.img-container');
        const originImg = _imgContainer.querySelector('img');
        const file = getUriToBlob(originImg.src, `${key}`)
        formData.append(key, file);
    })
    __galleryImgList.forEach((_img,index)=>{
        const key = _img.getAttribute('data-type');
        const subKey = _img.getAttribute('data-name');
        const dataURI = checkImageLoaded(_img);
        const file = getUriToBlob(dataURI, `gallery_${subKey}_${String(index).padStart(3, '0')}`)
        formData.append(`${key}[${index}][${subKey}]`, file);
    })
    __gallerySmImgList.forEach((_img,index)=>{
        const key = _img.getAttribute('data-type');
        const subKey = _img.getAttribute('data-name');
        const dataURI = checkImageLoaded(_img);
        const file = getUriToBlob(dataURI, `gallery_${subKey}_${String(index).padStart(3, '0')}`)
        formData.append(`${key}[${index}][${subKey}]`, file);
    })
    return formData;
}

// 이미지 로드 후 blob 데이터 뽑기
const checkImageLoaded = (_img) => {
    if(_img){
        // 이미지가 로드된 후 실행할 코드
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = _img.naturalWidth;
        canvas.height = _img.naturalHeight;
        // canvas에 이미지 그리기
        ctx.drawImage(_img, 0, 0);
        // 이미지 데이터 가져오기
        const dataURI = canvas.toDataURL('image/png');
        return dataURI
    }else{
        setTimeout(() => {
            checkImageLoaded(_img);
        }, 50);
    }
}


// uri 데이터를 blob 데이터로 변환
const getUriToBlob = (dataURI, fileName) => {
    // data URI to Blob
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Blob to File
    const file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" });
    return file;
}

// 텍스트 에디터 세팅
const tinymceList = [
    { 'id':'phrase_textarea', 'content' : message_templates_dict['sub_message'].trim(),}, 
    { 'id': 'transport_textarea_0', 'content' : transport_list[0]['contents_transport'].trim(),}, 
    { 'id' : 'transport_textarea_1','content' : transport_list[1]['contents_transport'].trim(),}, 
    { 'id' : 'transport_textarea_2','content' : transport_list[2]['contents_transport'].trim()}
]
tinymceList.forEach((item,index)=>{
    tinymce.init({
        selector: `#${item['id']}`,
        content: item['content'],
        toolbar: 'bold italic forecolor',
        height: 200,
        menubar: '',
        setup: function (editor) {
            editor.on('init', function () {
                editor.setContent(item['content']);
            });
        }
    });  
})


const getTransportHtml = () => {
    const transportList = ['버스', '지하철', '자가용']
    const __textArea = document.querySelectorAll('[data-type="transport_list"]')
    const transport_list = [];
    __textArea.forEach((textare,index)=>{
        transport_list.push({
            'title_transport' : transportList[index],
            'contents_transport' : getTextHtml(textare.id)
        })
    })
    return transport_list
}

// 텍스트 에디터를 이용하여 text 스타일 적용된 html 뽑기
const getTextHtml = (id) => {
    return tinymce.get(id).getContent();
}

// submit 데이터 쌓기
const getInputData = () => {
    const typeList = [
        'groom_dict', 
        'bride_dict', 
        'wedding_schedule_dict', 
        'message_templates_dict',
        'guestbook_password'
    ];
    const submitObj = new Object;
    typeList.forEach((type)=>{
        const __inputGroom = document.querySelectorAll(`[data-type="${type}"]`);
        const keyObj = new Object;
        __inputGroom.forEach((_inputGroom)=>{
            const key = _inputGroom.getAttribute('data-name');
            const value = _inputGroom.value;
            keyObj[key] = value;
            
        })
        submitObj[type] = keyObj
    })
    submitObj['bank_acc'] = getBankData()
    submitObj['message_templates_dict']['sub_message'] = getTextHtml('phrase_textarea');
    submitObj['transport_list'] = getTransportHtml()
    // console.log(submitObj)


    const formData = getImgData()
    formData.append('json', JSON.stringify(submitObj));
    postApi('/create', formData, callbackFun)

}
const callbackFun = (data) => {
    console.log('성공', data)
}

const setMainImg = () => {
    const mainAndSub = ['main', 'sub']
    mainAndSub.forEach((type)=>{
        const _mainImgInput = document.querySelector(`[data-type="image_list"][data-name="${type}_img"]`)
        const _imgContainer = _mainImgInput.closest('.img-container');
        let _canvas = _imgContainer.querySelector('canvas');
        const img = new Image();
        img.src = image_list[`${type}_img`];
        img.onload = function() {
            const dataURL = getSrcImgData(img);
            const canvas = createCanvasTag(_canvas, img);
            _canvas = canvas;
            setHasImg(_imgContainer, canvas)
            const _originImg = _imgContainer.querySelector('img')
            _originImg.src = dataURL;
        }
    })
}
const setGalleryImg = () => {
    const galleryImg = image_list['gallery_img'];
    galleryImg.forEach((imgData)=>{
        const originImgSrc = imgData['img'];
        const cropImgSrc = imgData['img_sm'];
        let html = `
            <div class="gallery-image img-container hasImg" onclick="clickAddImg(this);">
                <input type="file" accept="image/*" hidden="hidden" onchange="changeInputImg(this);">
                <p>클릭 후 업로드</p>
                <canvas width="300" height="300"></canvas>
                <img class="origin-img" src="${originImgSrc}" data-type="gallery_img" data-name="img" alt="">
                <img class="crop-img" src="${cropImgSrc}" data-type="gallery_img" data-name="img_sm" alt="">
            </div>
        `
        document.querySelector('form[name="gallery-info"] div').insertAdjacentHTML('afterbegin', html);
        const _imgContainer = document.querySelector('form[name="gallery-info"] div .hasImg');
        let _canvas =  _imgContainer.querySelector('canvas');
        const _originImg = _imgContainer.querySelector('.origin-img');
        const _cropImg = _imgContainer.querySelector('.crop-img');

        _originImg.addEventListener("load", function() {
            const dataURL = getSrcImgData(_originImg);
            _originImg.src = dataURL;
            setGalleryHasImg(_imgContainer, dataURL)
            setHasImg(_imgContainer, _canvas)

            // 이벤트 리스너 제거
            _originImg.removeEventListener("load", this);
        }, { once: true });

        _cropImg.addEventListener("load", function() {
            const dataURL = getSrcImgData(_cropImg);
            const canvas = createCanvasTag(_canvas, _cropImg);
            _canvas = canvas;
            _cropImg.src = dataURL;
            // 이벤트 리스너 제거
            _cropImg.removeEventListener("load", this);
        }, { once: true });
    })
}
// src 데이터로 이미지 데이터 뽑기
const getSrcImgData = (img) => {
    const subCanvas = document.createElement("canvas");
    const context = subCanvas.getContext("2d");
    subCanvas.width = img.width;
    subCanvas.height = img.height;
    context.drawImage(img, 0, 0);
    // 그려진 이미지 데이터 사용 예시
    const imageData = context.getImageData(0, 0, subCanvas.width, subCanvas.height);
    const dataURL = subCanvas.toDataURL();
    // console.log(imageData,dataURL);
    return dataURL
} 
if(image_list){
    setMainImg()
    setGalleryImg()
}

