var lastSentOrientation = 0;

function moveFwd() {
  Tiltspot.msgToGame("move", {v: 1.0});
}

function moveBwd() {
  Tiltspot.msgToGame("move", {v: -1.0});
}

function resetV() {
  Tiltspot.msgToGame("move", {v: 0.0});
}

function handleOrientationEvent(orientation) {
  if(lastSentOrientation + 100 < new Date().getTime()){
    lastSentOrientation = new Date().getTime();
    var steer = (orientation.accelerationIncludingGravity.y / -5).toFixed(2);
    Tiltspot.msgToGame("move", {h: steer});
    document.getElementById("deviceorientation").innerHTML = (steer);
  }
}

window.onload = function() {
  document.getElementById("ButtonFwd").addEventListener("touchstart", moveFwd, false);
  document.getElementById("ButtonFwd").addEventListener("touchend", resetV, false);
  document.getElementById("ButtonBwd").addEventListener("touchstart", moveBwd, false);
  document.getElementById("ButtonBwd").addEventListener("touchend", resetV, false);

  window.addEventListener("devicemotion", handleOrientationEvent, false);
}