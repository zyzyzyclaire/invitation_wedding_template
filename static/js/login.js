const loginSubmit = (event) =>{
  event.preventDefault();
  const __input = document.querySelectorAll(`form .inputBox input`)
  const submitData = new Object();
  __input.forEach((_input)=>{
    const dataKey = _input.id.split('input')[1].toLocaleLowerCase()
    submitData[dataKey] = _input.value;
  })
  postApi('/login_check', submitData, callbackFun);
}

const callbackFun = (data) => {
  console.log(data)
}