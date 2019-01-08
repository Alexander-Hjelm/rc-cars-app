function moveFwd() {
  Tiltspot.msgToGame("move", {v: 1.0});
}

function moveBwd() {
  Tiltspot.msgToGame("move", {v: -1.0});
}

function resetV() {
  Tiltspot.msgToGame("move", {v: 0.0});
}

function handleOrientationEvent(frontToBack, leftToRight, rotateDegrees) {
  
  var steer = (-rotateDegrees+180) / 90.0;
  //var steer = rotateDegrees;
  //Gir -2 til 2. rett opp er -2 og 2. Vi ønsker nærmest 0, som er rett ned. 
  //
  Tiltspot.msgToGame("move", {h: steer});
}

window.onload = function() {
  document.getElementById("ButtonFwd").addEventListener("touchstart", moveFwd, false);
  document.getElementById("ButtonFwd").addEventListener("touchend", resetV, false);
  document.getElementById("ButtonBwd").addEventListener("touchstart", moveBwd, false);
  document.getElementById("ButtonBwd").addEventListener("touchend", resetV, false);

  window.addEventListener("deviceorientation", function(event) {
        // alpha: rotation around z-axis
        var rotateDegrees = event.alpha;
        // gamma: left to right
        var leftToRight = event.gamma;
        // beta: front back motion
        var frontToBack = event.beta;

        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
        
    }, true);
}
