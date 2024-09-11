var title = document.getElementById("title");
var audio = document.getElementById("audio");
var playlist = [
  "beautiful_night.mp3",
  "escape.mp3",
  "Snooze.mp3",
  "Sugarcoat.mp3",
  "INVU.mp3",
];
var loopbtn = document.getElementById("loopbtn");
var selectPlayList = document.getElementById("selectPlayList");
var selectIndex = selectPlayList.selectedIndex;
var volController = document.getElementById("volController");
var volvalue = volController.children[3];
var volRange = volController.children[0];
var progressBar = document.getElementById("progressBar");
var songList = document.getElementById("songList");
var info = document.getElementById("info");
var fullLoopbtn = document.getElementById("fullLoopbtn");
var book = document.getElementById("book");
var bookSource = book.children[0];
var bookTarget = book.children[1];
var playpausebtn = document.getElementById("playpausebtn");
var stop = document.getElementById("stop");
//---------------------------------------------
setVolumeByRange(); //設定初始音量

function showBook() {
  book.style.display = book.style.display == "flex" ? "none" : "flex";
}

//更新音樂池
function updateMusicPool() {
  //清空音樂池
  for (var i = selectPlayList.children.length - 1; i >= 0; i--) {
    selectPlayList.remove(i);
  }

  //讀取bookTarget裡的歌給音樂池
  for (var i = 0; i < bookTarget.children.length; i++) {
    var option = document.createElement("option");
    option.value = bookTarget.children[i].title;
    option.innerText = bookTarget.children[i].innerText;

    selectPlayList.appendChild(option);
  }
  changeMusic(0);
}

//====drag & drop的功能區=====

function allowDrop(ev) {
  ev.preventDefault(); //放棄物件預設行為
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id); //抓取正在拖曳的物件
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  // ev.target.appendChild(document.getElementById(data));
  console.log(ev.target);

  if (ev.target.id == "") ev.target.appendChild(document.getElementById(data));
  else ev.target.parentNode.appendChild(document.getElementById(data));
}

//初始化音樂池
function InitMusicPool() {
  for (var i = 0; i < bookSource.children.length; i++) {
    var option = document.createElement("option");
    bookSource.children[i].id = "song" + (i + 1);
    bookSource.children[i].draggable = "true";
    bookSource.children[i].ondragstart = drag;

    option.value = bookSource.children[i].title;
    option.innerText = bookSource.children[i].innerText;

    selectPlayList.appendChild(option);
  }
  changeMusic(0);
}
InitMusicPool();

//啟動隨機、單曲、全部循環的播放狀態
function setFuncBtnStatus() {
  for (var i = 9; i < music_player.children.length; i++) {
    music_player.children[i].className = "";
  }
  event.target.className =
    info.children[2].innerText != event.target.title ? "btnBColor" : "";
  info.children[2].innerText =
    info.children[2].innerText != event.target.title
      ? event.target.title
      : "正常";
}
//一開始的歌曲全部循環 or 隨機播放 or 單曲循環
function getMusicStatus() {
  if (audio.currentTime == audio.duration) {
    if (info.children[2].innerText == "隨機播放") {
      var r = Math.floor(Math.random() * selectPlayList.children.length);
      r -= selectPlayList.selectedIndex;
      changeMusic(r);
    } else if (info.children[2].innerText == "單曲循環") {
      changeMusic(0);
    } else if (
      /*info.children[2].innerText == "全部循環" &&*/
      selectPlayList.selectedIndex == selectPlayList.children.length - 1
    ) {
      //換到第一首
      changeMusic(0 - selectPlayList.selectedIndex);
    } else if (
      selectPlayList.selectedIndex ==
      selectPlayList.children.length - 1
    )
      stopMusic();
    else changeMusic(1);
  }
}

//清單換歌
function changeMusic(n) {
  //console.log(selectPlayList.selectedIndex); //只有清單被選擇時才會改變值
  var i = selectPlayList.selectedIndex + n;
  if (i % selectPlayList.length == 0){
    i=0;
   } 
  else if (i < 0){
    i = selectPlayList.length - 1;
  } 
  audio.src = selectPlayList.children[i].value;
  audio.title = selectPlayList.children[i].innerText;
  title.innerText = selectPlayList.children[i].innerText;
  selectPlayList.children[i].selected = true;

  clearInterval(ProgressTaskID);

  if (playpausebtn.innerText == ";") {
    audio.onloadeddata = playMusic;
  }
}

//轉換時間(單位:秒)
function getTimeFormat(t) {
  var m = parseInt(t / 60);
  var s = parseInt(t) % 60;

  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  return m + ":" + s;
}

function getTimerForInfo() {
  info.children[1].innerText =
    getTimeFormat(audio.currentTime) + "/" + getTimeFormat(audio.duration);
}

//取得進度條資訊
function getProgress() {
  // console.log(parseInt(audio.currentTime));
  var w = (audio.currentTime / audio.duration) * 100;
  progressBar.value = audio.currentTime * 10000; //歌曲進度條
  progressBar.style.backgroundImage = `-webkit-linear-gradient(left,rgb(197, 7, 0) ${w}%,rgb(236, 236, 234) ${w}%)`;
  //console.log(parseInt(audio.currentTime) / parseInt(audio.duration) * 100);
  //setTimeout(test, 700);
}

//從進度條改變歌曲時間位置
function setProgress() {
  //console.log(progressBar.value);
  audio.currentTime = progressBar.value / 10000;
}
//------------------------------------------------------
function nextTime() {
  audio.currentTime += 10;
}
function prevTime() {
  audio.currentTime -= 10;
}
var ProgressTaskID;

//播放
function playMusic() {
  audio.play();
  playpausebtn.innerText = ";";

  playpausebtn.onclick = pauseMusic;

  progressBar.max = audio.duration * 10000;

  ProgressTaskID = setInterval(function () {
    getProgress();
    getTimerForInfo();
    getMusicStatus();
  }, 1);
  info.children[0].innerText = audio.title;
}

//暫停
function pauseMusic() {
  audio.pause();
  playpausebtn.innerText = "4";
  playpausebtn.onclick = playMusic;
  getProgress();
  clearInterval(ProgressTaskID);
  info.children[0].innerText = "音樂暫停";
}

//停止
function stopMusic() {
  pauseMusic();
  audio.currentTime = 0;
  //progressBar.value=0;
  //playpausebtn.innerText = "4";
  getProgress();
  clearInterval(ProgressTaskID);
  info.children[0].innerText = "音樂停止";
}

//歌曲播放快速
function quickMusic() {
  audio.playbackRate += 0.25;
} //歌曲播放慢速
function slowMusic() {
  audio.playbackRate -= 0.25;
} //歌曲播放正常速度
function normalMusic() {
  audio.playbackRate = 1;
}
function setVolumeByButton(v) {
  volRange.value = parseInt(volvalue.value) + v;
  setVolumeByRange();
}
function setVolumeByRange() {
  audio.volume = volRange.value / 100;
  volvalue.value = volRange.value;
  volRange.style.backgroundImage = `-webkit-linear-gradient(left,rgb(219, 174, 75) ${volRange.value}%,rgb(241, 243, 228) ${volRange.value}%)`;
}
//靜音&取消靜音
function mute() {
  audio.muted = !audio.muted;
  if (audio.muted) mutebtn.innerText = "V";
  else mutebtn.innerText = "U";
}

