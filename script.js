const messageContainer = document.querySelector('#d-day-message');
const container = document.querySelector('#d-day-container');
const intervalIdArr = [];
const savedDate = localStorage.getItem('saved-date'); //localStorage에 'saved-date'라는 키와 대응 되는 벨류가 savedDate라는 변수에 담겨진다

const dataFormMaker = function () {
  const inputYear = document.querySelector('#target-year-input').value;
  const inputMounth = document.querySelector('#target-month-input').value;
  const inputDate = document.querySelector('#target-date-input').value;

  const dateFormat = `${inputYear}-${inputMounth}-${inputDate}`;
  return dateFormat; //dataFormat 값을 외부에서 사용하기 위해 반환해줌
};
const countMaker = function (data) {
  if (data !== savedDate) {
    //받아온 데이터와 저장되어있는 데이터가 다를 때

    //사용자가 입력했던 데이터를 남기기 위해 localStorage 사용. setItem(key, value)형태
    localStorage.setItem('saved-date', data);
  }
  const targetDateInput = dataFormMaker(); //dataFormatMaker에서 반환한 dataFormat값을 사용하기 위해 변수에 함수를 불러옴
  const nowDate = new Date(); //현재 날짜&시간
  const targetDate = new Date(data).setHours(0, 0, 0, 0); //목표한 날짜 입력 / setHours(0,0,0,0) : 자정을 기준으로 시간을 다시 구함
  const restTime = targetDate - nowDate; //남아있는 시간 구하기
  const remaining = restTime / 1000; //소수점 구분을 위한 1000나누기

  if (remaining === 0 || remaining <= 0) {
    //만약 타이머 설정한 시간이 0이거나 0보다 작을 시 종료
    container.style.display = 'none';
    messageContainer.innerHTML = '<h3>타이머가 종료되었습니다.</h3>';
    messageContainer.style.display = 'flex';
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    //만약 측정 불가 시간 때를 입력했을 시
    container.style.display = 'none';
    messageContainer.innerHTML = '<h3>유효한 시간 때가 아닙니다.</h3>';
    messageContainer.style.display = 'flex';
    setClearInterval();
    return;
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

  //아래는 시간이 10 밑으로 떨어졌을 때 09 08 07 이런식으로 나올 수 있도록 하는 함수
  const format = function (time) {
    if (time < 10) {
      return '0' + time;
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    document.getElementById(tag).textContent = remainingTime;
    i++;
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
const starter = function (targetDateInput) {
  if (!targetDateInput) {
    //만일 targetDateInput이 undefined라면,
    targetDateInput = dataFormMaker(); //dataFormatMaker에서 반환한 dataFormat값을 사용하기 위해 변수에 함수를 불러옴
  }

  container.style.display = 'flex'; //일, 시간, 초 나오는 컨테이너의 스타일을 수정
  messageContainer.style.display = 'none'; //디데이를 입력해주세요의 컨테이너 display를 사라질 수 있도록 수정
  setClearInterval(); //카운트다운 시작 후 날짜 변경 했을 때 생기는 이상한 오류 해결하기 위해 인터벌 모두 삭제하는 기능 추가
  countMaker(targetDateInput); //처음에 측정 전에 0일 0시간 0분 0초가 보이지 않고 바로 측정하기 위해 함수를 한번 호출 한 후 아래 측정 코드를 실행
  const intervalId = setInterval(() => {
    countMaker(targetDateInput);
  }, 1000); //setInterval함수는 아래의 for문과 setTimeout함수보다 더 간단하게 사용될 수 있다.
  //변수 intervalId는 반복중인 코드의 id 값이다.
  intervalIdArr.push(intervalId); //starter 함수가 실행될 때마다 intarval이 생성될 것이고
  //그 후에  intervalArr에 intervalId를 넣어줄 것이다.

  // for (let i = 0; i < 100; i++) {
  // setTimeout(() => {
  //   //setTimeout은 뒤의 1000*i이라는 숫자 만큼 지나면 countMaker함수가 실행됨
  //   countMaker(); //버튼과 연결된 함수를 stater 함수와 연결해서 여기서 실행시킬 수 있도록 수정
  // }, 1000 * i);
  // }
};

const setClearInterval = function () {
  localStorage.removeItem('saved-date'); //타이머초기화버튼 클릭 시 로컬호스트 스토리지에 저장된 데이터 삭제
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
};

//위의 함수를 사용하게 될 때 날짜를 쓰지 않거나 이상하게 입력했을 때 메세지 컨테이너가 적용이 안되어
//아래와 같은 함수를 선언
const resetTimer = function () {
  container.style.display = 'none'; //타이머 초기화 버튼 클릭 시 이전 기록 사라지게 하는 기능
  messageContainer.innerHTML = '<h3>D-day를 입력해주세요.</h3>'; //타이머 초기화 버튼 클릭 시 이전 기록 사라지게 하는 기능
  messageContainer.style.display = 'flex'; //D-day를 입력해주세요라는 컨테이너가 통째로 사라지기에 스타일 값에 flex로 준다
  setClearInterval();
};

//localhost 스토리지에 데이터를 남기기 위해 추가로 사용되는 함수
//이 함수는 데이터가 올바르게 저장되어있는지 조건식을 사용함
if (savedDate) {
  starter(savedDate);
} else {
  container.style.display = 'none'; //display에 none 값을 줌으로써 0일0시간0분0초라는 메세지가 사라지게 함
  messageContainer.innerHTML = '<h3>D-day를 입력해주세요.</h3>';
}
