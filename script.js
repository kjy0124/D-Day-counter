const messageContainer = document.querySelector('#d-day-message');
const container = document.querySelector('#d-day-container');

// container.style.display = 'none'; //display에 none 값을 줌으로써 0일0시간0분0초라는 메세지가 사라지게 함
messageContainer.innerHTML = '<h3>D-day를 입력해주세요.</h3>';

const dataFormMaker = function () {
  const inputYear = document.querySelector('#target-year-input').value;
  const inputMounth = document.querySelector('#target-month-input').value;
  const inputDate = document.querySelector('#target-date-input').value;

  const dateFormat = `${inputYear}-${inputMounth}-${inputDate}`;
  return dateFormat; //dataFormat 값을 외부에서 사용하기 위해 반환해줌
};
const countMaker = function () {
  const targetDateInput = dataFormMaker(); //dataFormatMaker에서 반환한 dataFormat값을 사용하기 위해 변수에 함수를 불러옴
  const nowDate = new Date(); //현재 날짜&시간
  const targetDate = new Date(targetDateInput).setHours(0, 0, 0, 0); //목표한 날짜 입력 / setHours(0,0,0,0) : 자정을 기준으로 시간을 다시 구함
  const restTime = targetDate - nowDate; //남아있는 시간 구하기
  const remaining = restTime / 1000; //소수점 구분을 위한 1000나누기

  if (remaining === 0 || remaining <= 0) {
    //만약 타이머 설정한 시간이 0이거나 0보다 작을 시 종료
    messageContainer.innerHTML = '<h3>타이머가 종료되었습니다.</h3>';
  } else if (isNaN(remaining)) {
    //만약 측정 불가 시간 때를 입력했을 시
    messageContainer.innerHTML = '<h3>유효한 시간 때가 아닙니다.</h3>';
  }

  const remainingObj = {
    remainingDate: Math.floor(remaining / 86400), //남아있는 날짜를 알아내기 위해 남아있는 날짜/(60(초)*60(분)*24(시간))
    remainingHours: Math.floor((remaining / 3600) % 24), //남아있는 시간을 알아내기 위해 남아있는 날짜를 24로 나눴을 때 나머지 값을 60(초)*60(분)으로 나눠줌
    remainingMin: Math.floor((remaining / 60) % 60),
    remainingSec: Math.floor(remaining % 60),
  };

  const documentArr = ['days', 'hours', 'min', 'sec'];

  const timeKeys = Object.keys(remainingObj); //remainObj의 keyr값을 배열에 저장
  //temeKeys의 배열에는 ['remainingDate', 'remainingHours', 'remainingMin', 'remainingSec']와 같다.

  let i = 0;
  for (let tag of documentArr) {
    document.getElementById(tag).textContent = remainingObj[timeKeys[i]];
  }
  // const documentObj = {
  //   days: document.getElementById('days'),
  //   hours: document.getElementById('hours'),
  //   min: document.getElementById('min'),
  //   sec: document.getElementById('sec'),
  // };

  // const docKeys = Object.keys(documentObj); //0일 0시간 0분 0초 데이터를 docKeys에 배열로 저장
  //바로 위 코드는 바로 아래의 반복문에만 필요했기 때문에 더 이상 필요 없어졌다.

  // for (let i = 0; i < timeKeys.length; i++) {
  //   //i가 timeKeys 배열의 길이 만큼 반복
  //   documentObj[docKeys[i]].textContent = remainingObj[timeKeys[i]]; //documentObj의 docKeys 키값들을 i만큼 반복하며
  // } //textContent로 시간이 표시될 수 있도록 시간 계산하는 변수 remainObj 변수를 사용하여 timeKeys를 마지막으로 사용하여 텍스트에 뜰 수 있도록 표시

  //위 반복문 대신 아래의 반복문을 사용해도 된다.
  // let i = 0;
  // for (let key in documentObj) {
  //   //documentObj안에 key값 즉, days, hours, min, sec 만큼 반복한다.
  //   //documentObj의 키를 text화 하며 동시에 remainObj를 timeKeys의 크기만큼 반복하여 대입해준다.
  //   documentObj[key].textContent = remainingObj[[timeKeys[i]]];
  //   i++; //위의 teimeKeys의 배열이 반복하며 인덱스를 하나씩 늘려주기 위하여 i의 증감문을 추가작성
  // }

  //아래의 코드들이 바로 위 반복문 사용으로 인해 불필요하게 됨
  //아래의 남은 시간을 위의 days, hours, min, sec에 삽입
  // documentObj['days'].textContent = remainingObj['remainingDate']; //remainObj의 remainingDate의 값을 가져옴
  // documentObj['hours'].textContent = remainingObj['remainingHours'];
  // documentObj['min'].textContent = remainingObj['remainingMin'];
  // documentObj['sec'].textContent = remainingObj['remainingSec'];
};
