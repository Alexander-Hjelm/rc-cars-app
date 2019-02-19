var lastSentOrientation = 0;
var screen = 0;

Tiltspot.onGameMsg = function (msg, data) {
  switch (msg) { 
    case 'color-reserved':
      updateColor(msg, data);
    case 'color-unreserved':
      updateColor(msg, data);
    case 'start': //timeout kan tas bort om loading ikke er ønskelig
      updateScreen(0);
      setTimeout(function () {
        updateScreen(2);
      }, 1000);
  }
}

function updateScreen(screenSwitch){
  switch (screenSwitch) { 
    case 0:
      console.log("loading");
      document.getElementById("drive").style.display = "none"; 
      document.getElementById("color-pick").style.display = "none"; 
      document.getElementById("loading").style.display = "flex";
      break;
    case 1:
      console.log("color");
      document.getElementById("drive").style.display = "none"; 
      document.getElementById("loading").style.display = "none";
      document.getElementById("color-pick").style.display = "flex"; 
      break;
    case 2:
      console.log("drive");
      document.getElementById("loading").style.display = "none";
      document.getElementById("color-pick").style.display = "none"; 
      document.getElementById("drive").style.display = "flex"; 
      break;
    case 3:
      break;
    case 4:
      console.log("4");
      document.getElementById("menu-open").style.display = "flex";
      break;
    case 5: 
      console.log("5");
      document.getElementById("menu-open").style.display = "none";
      break;  
    case 6:
      var temp = document.getElementById("ready");
      if(temp.innerHTML == "READY"){
        Tiltspot.msgToGame('ready');
        temp.style.backgroundColor = "crimson";
        temp.innerHTML = "CANCEL";
        updateOpacity("deactivate", "10%");
      }else if (temp.innerHTML == "CANCEL"){
        Tiltspot.msgToGame('unready');
        temp.style.backgroundColor = "green";
        temp.innerHTML = "READY";
        updateOpacity("deactivate", "100%");
      }else { //stupid fix for first click.. 
        Tiltspot.msgToGame('ready');
        temp.style.backgroundColor = "crimson";
        temp.innerHTML = "CANCEL";
        updateOpacity("deactivate", "10%");
      }
      break;
    default:
      console.log("none");
  }
}

function updateOpacity(className, opacity){
  var temp = document.getElementsByClassName(className);
    for (i = 0; i < temp.length; i++) {
      temp[i].style.filter = "opacity("+opacity+")";
    }
}

function updateColor (msg, color){
  var temp; 
  switch(color){
    case {r: "0", g: "128", b: "0"}:
      temp = "color-green"
      break;
    case {r: "128", g: "0", b: "128"}:
      temp = "color-purple"
      break;
    case {r: "255", g: "0", b: "0"}:
      temp = "color-red"
      break;
    case {r: "0", g: "31", b: "255"}:
      temp = "color-blue"
      break;
    case {r: "139", g: "69", b: "19"}:
      temp = "color-brown"
      break;
    case {r: "255", g: "255", b: "0"}:
      temp = "color-yellow"
      break;
    case {r: "0", g: "255", b: "255"}:
      temp = "color-cyan"
      break;
    case {r: "255", g: "255", b: "255"}:
      temp = "color-white"
      break;
    default:
      console.log("none");
  }

  if(msg == 'color-reserved'){
    document.getElementById(temp).classList.add("active");
  }else if(msg == 'color-unreserved'){
    document.getElementById(temp).classList.remove("active");
  }
}

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
    var steer = ((orientation.accelerationIncludingGravity.y / 5)*0.5).toFixed(2);
    
    if (orientation.accelerationIncludingGravity.x < 0) {
      steer *= -1;
    }

    Tiltspot.msgToGame("move", {h: steer});
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
  updateScreen(0);
  setTimeout(function () {
    updateScreen(1);
  }, 2000);
  
  //Car
  window.addEventListener("devicemotion", handleOrientationEvent, false);
  document.getElementById("buttonFwd").addEventListener("touchstart", moveFwd, false);
  document.getElementById("buttonFwd").addEventListener("touchend", resetV, false);
  document.getElementById("buttonBwd").addEventListener("touchstart", moveBwd, false);
  document.getElementById("buttonBwd").addEventListener("touchend", resetV, false);
  document.getElementById("buttonFire").addEventListener("touchstart", fire, false);
  
  //Car and color meny
  var colors = document.getElementsByClassName("colors")
  for (i = 0; i < colors.length; i++) {
    colors[i].addEventListener("click", function(e){
      var temp = document.getElementById(e.target.id);
      var temp2; 
      switch(e.target.id){
        case "color-green":
          temp2 = {r: "0", g: "128", b: "0"}
          break;
        case "color-purple":
          temp2 = {r: "128", g: "0", b: "128"}
          break;
        case "color-red":
          temp2 = {r: "255", g: "0", b: "0"}
          break;
        case "color-blue":
          temp2 = {r: "0", g: "31", b: "255"}
          break;
        case "color-brown":
          temp2 = {r: "139", g: "69", b: "19"}
          break;
        case "color-yellow":
          temp2 = {r: "255", g: "255", b: "0"}
          break;
        case "color-cyan":
          temp2 = {r: "0", g: "255", b: "255"}
          break;
        case "color-white":
          temp2 = {r: "255", g: "255", b: "255"}
          break;
        default:
          console.log("none");
      }

      if(temp.classList.contains("active")){
        console.log("choosen allready");
        //Tiltspot.msgToGame('color-unreserved', temp2);
        //temp.classList.remove("active");
      }else {
        Tiltspot.msgToGame('color-selected', temp2);
        temp.classList.add("active");
      }
    });
  }
  document.getElementById("left").addEventListener("click", function(){Tiltspot.msgToGame('move', {val: "left"})}, false); //Send move, data: value: "left"
  document.getElementById("right").addEventListener("click", function(){Tiltspot.msgToGame('move', {val: "right"})}, false); //Send move, data: value: "right"

  document.getElementById("ready").addEventListener("click", function(){updateScreen(6);}, false); 

  //Menu
  document.getElementById("menu").addEventListener("click", function(){updateScreen(1);}, false); //change to run just updateScreen with menu param. 
  //document.getElementById("menu").addEventListener("click", function(){updateScreen(4);}, false); //change to run just updateScreen with menu param. 
  document.getElementById("menu-close").addEventListener("click", function(){updateScreen(5);}, false)
}
