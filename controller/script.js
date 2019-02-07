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

function fire() {
  Tiltspot.msgToGame("fire", {});
}

function handleOrientationEvent(orientation) {
  if(lastSentOrientation + 100 < new Date().getTime()){
    lastSentOrientation = new Date().getTime();
    var steer = (orientation.accelerationIncludingGravity.y / 5).toFixed(2);
    
    if (orientation.accelerationIncludingGravity.x < 0) {
      steer *= -1;
    }

    Tiltspot.msgToGame("move", {h: steer*0.5});
  
    document.getElementById("deviceorientation").innerHTML = (steer);

    if(steer < 0) {
      document.getElementById("tilt-right").style.backgroundColor = "#205a67";
      document.getElementById("tilt-left").style.backgroundColor = "#138058a6";
    }else if(steer > 0){
      document.getElementById("tilt-right").style.backgroundColor = "#138058a6";
      document.getElementById("tilt-left").style.backgroundColor = "#205a67";
    }else {
      document.getElementById("tilt-left").style.backgroundColor = "#205a67";
      document.getElementById("tilt-right").style.backgroundColor = "#205a67";
    }
  }
}

window.onload = function() {

  document.getElementById("ButtonFwd").addEventListener("touchstart", moveFwd, false);
  document.getElementById("ButtonFwd").addEventListener("touchend", resetV, false);
  document.getElementById("ButtonBwd").addEventListener("touchstart", moveBwd, false);
  document.getElementById("ButtonBwd").addEventListener("touchend", resetV, false);
  document.getElementById("ButtonFire").addEventListener("touchstart", fire, false);

  window.addEventListener("devicemotion", handleOrientationEvent, false);
}
