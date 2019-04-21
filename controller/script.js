var lastSentOrientation = 0;
var myColor = 'color-0';
var myColorCode;
var ready = false;
var readyP = false;
var dead = false;

Tiltspot.on.ready = function() {};

Tiltspot.on.msg = function(msg, data) {
	switch (msg) {
		case 'color-reserved':
			updateColor(msg, data);
			break;
		case 'color-unreserved':
			updateColor(msg, data);
			break;
		case 'ready-query':
			Tiltspot.send.msg('ready');
			break;
		case 'ReconnectData':
			var tempState = data['state-id'];
			myColorCode = { r: data['r'], g: data['g'], b: data['b'] };
			setVisibility(tempState);

			setTimeout(function() {
				setColor('rgb(' + myColorCode.r + ',' + myColorCode.g + ',' + myColorCode.b + ')');
			}, 100);
			document.getElementById('choosing-car-ready-text').style.display = 'flex';
			if (tempState == 1) {
			} else if (tempState == 4) {
				//set car, 'car-id' : <integer>,
			} else if (tempState == 5 || tempState == 6) {
				//set powerup, 'active-powerup-id' : <integer>,
			}
			break;
		case 'defeated-round':
			dead = true;
			document.getElementById('driving-defeated-round').style.display = 'flex';
			break;
		case 'round-restart':
			dead = false;
			document.getElementById('driving-defeated-round').style.display = 'none';
			break;
		case 'defeated-game':
			document.getElementById('driving-defeated-game').style.display = 'flex';
			break;
		case 'state-id': //var update-state, wrong in com. doc.
			document.getElementById('driving-defeated-round').style.display = 'none'; //temp fix
			setVisibility(data['state-id']);
			break;
		case 'state-query':
			//response: state-response,  'data' : 'state-id' : <integer>
			break;
	}
};

function setVisibility(id) {
	if (id == 1) {
		document.getElementById('loading').style.display = 'flex';
	} else {
		document.getElementById('loading').style.display = 'none';
	}
	if (id == 2) {
		document.getElementById('menu').style.display = 'flex';
	} else {
		document.getElementById('menu').style.display = 'none';
	}
	if (id == 3) {
		document.getElementById('waiting').style.display = 'flex';
	} else {
		document.getElementById('waiting').style.display = 'none';
	}
	if (id == 4) {
		document.getElementById('choosing').style.display = 'flex';
	} else {
		document.getElementById('choosing').style.display = 'none';
	}
	if (id == 5) {
		document.getElementById('practice').style.display = 'flex';
	} else {
		document.getElementById('practice').style.display = 'none';
	}
	if (id == 6) {
		dead = false;
		document.getElementById('driving').style.display = 'flex';
	} else {
		document.getElementById('driving').style.display = 'none';
	}
}
function updateColor(msg, data) {
	var temp;
	if (data.r == 255 && data.g == 0 && data.b == 0) {
		temp = 'color-1';
	} else if (data.r == 0 && data.g == 26 && data.b == 255) {
		temp = 'color-2';
	} else if (data.r == 255 && data.g == 224 && data.b == 0) {
		temp = 'color-3';
	} else if (data.r == 25 && data.g == 255 && data.b == 0) {
		temp = 'color-4';
	} else if (data.r == 255 && data.g == 0 && data.b == 239) {
		temp = 'color-5';
	} else if (data.r == 0 && data.g == 250 && data.b == 255) {
		temp = 'color-6';
	} else if (data.r == 255 && data.g == 123 && data.b == 0) {
		temp = 'color-7';
	} else if (data.r == 166 && data.g == 0 && data.b == 255) {
		temp = 'color-8';
	} else {
		return;
	}

	if (msg == 'color-reserved') {
		if (myColor == temp) return;
		document.getElementById(temp).style.filter = 'grayscale(0.9)';
		document.getElementById(temp).style.webkitFilter = 'grayscale(0.9)';
	} else if (msg == 'color-unreserved') {
		document.getElementById(temp).style.filter = 'grayscale(0)';
		document.getElementById(temp).style.webkitFilter = 'grayscale(0)';
	}
}

function resetV() {
	Tiltspot.send.msg('move', { v: 0.0 });
}

function handleOrientationEvent(orientation) {
	if (lastSentOrientation + 100 < new Date().getTime() /*&& !dead && (ready || readyP)*/) {
		lastSentOrientation = new Date().getTime();
		var steer = (orientation.accelerationIncludingGravity.y / 5).toFixed(2);

		if (orientation.accelerationIncludingGravity.x < 0) {
			steer *= -1;
		}

		Tiltspot.send.msg('move', { h: steer });

		var tempSteer = steer * 10;
		if (steer > 0.3) steer = 0.3;
		else if (steer < -0.3) steer = -0.3;
		document.getElementById('visual-col-2').style.transform = 'rotate(' + steer * 10 + 'deg)';
		document.getElementById('visual-col-2').style.webkitTransform = 'rotate(' + steer * 10 + 'deg)';
	}
}

function setControllerColor(color) {
	document.documentElement.style.setProperty('--driving-color', color + '0.7)');
	document.documentElement.style.setProperty('--driving-color-active', color + '1)');
}

function setColor(colorId) {
	switch (colorId) {
		case 'color-1':
		case 'rgb(255,0,0)':
			myColor = 'color-1';
			myColorCode = { r: '255', g: '0', b: '0' };
			document.getElementById('selected-1').style.display = 'flex';
			break;
		case 'color-2':
		case 'rgb(0,26,255)':
			myColor = 'color-2';
			myColorCode = { r: '0', g: '26', b: '255' };
			document.getElementById('selected-2').style.display = 'flex';
			break;
		case 'color-3':
		case 'rgb(255,224,0)':
			myColor = 'color-3';
			myColorCode = { r: '255', g: '224', b: '0' };
			document.getElementById('selected-3').style.display = 'flex';
			break;
		case 'color-4':
		case 'rgb(25,255,0)':
			myColor = 'color-4';
			myColorCode = { r: '25', g: '255', b: '0' };
			document.getElementById('selected-4').style.display = 'flex';
			break;
		case 'color-5':
		case 'rgb(255,0,239)':
			myColor = 'color-5';
			myColorCode = { r: '255', g: '0', b: '239' };
			document.getElementById('selected-5').style.display = 'flex';
			break;
		case 'color-6':
		case 'rgb(0,250,255)':
			myColor = 'color-6';
			myColorCode = { r: '0', g: '250', b: '255' };
			document.getElementById('selected-6').style.display = 'flex';
			break;
		case 'color-7':
		case 'rgb(255,123,0)':
			myColor = 'color-7';
			myColorCode = { r: '255', g: '123', b: '0' };
			document.getElementById('selected-7').style.display = 'flex';
			break;
		case 'color-8':
		case 'rgb(166,0,255)':
			myColor = 'color-8';
			myColorCode = { r: '166', g: '0', b: '255' };
			document.getElementById('selected-8').style.display = 'flex';
			break;
		default:
			console.log('none');
	}

	setControllerColor('rgba(' + myColorCode.r + ',' + myColorCode.g + ',' + myColorCode.b + ', ');
	changeColor('rgba(' + myColorCode.r + ',' + myColorCode.g + ',' + myColorCode.b + ')');
}

window.onload = function() {
	var colors = document.getElementsByClassName('choosing-colors');
	for (i = 0; i < colors.length; i++) {
		colors[i].addEventListener('click', function(e) {
			var temp = document.getElementById(e.currentTarget.id);

			if (document.getElementById(temp.id).style.filter == 'grayscale(0.9)' || ready) return;
			if (myColor == temp.id) return;
			if (myColorCode && myColor != temp.id) Tiltspot.send.msg('color-unreserved', myColorCode);
			if (myColor != 'color-0') {
				document.getElementById('selected-' + myColor.split('-').pop()).style.display = 'none';
				document.getElementById(myColor).getElementsByTagName('img')[0].className = '';
			}

			setColor(e.currentTarget.id);
			myColor = temp.id;

			document.getElementById('choosing-car-ready-text').style.display = 'flex';
			document.getElementById(myColor).getElementsByTagName('img')[0].className = 'pulsate';
			document.getElementById('selected-' + myColor.split('-').pop()).style.display = 'flex';
			Tiltspot.send.msg('color-selected', myColorCode);
		});
	}

	window.addEventListener('devicemotion', handleOrientationEvent, false);

	document.getElementById('driving-col-1').addEventListener('touchend', resetV, false);
	document.getElementById('driving-col-2').addEventListener('touchend', resetV, false);

	document.getElementById('driving-col-1').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('move', { v: -1.0 });
		},
		false
	);
	document.getElementById('driving-col-2').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('move', { v: 1.0 });
		},
		false
	);

	document.getElementById('driving-row-2').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('fire', {});
		},
		false
	);

	document.getElementById('practice-row-2').addEventListener(
		'click',
		function() {
			if (readyP) {
				Tiltspot.send.msg('unready', {});
				readyP = false;
				document.getElementById('practice-ready').style.backgroundColor = 'var(--driving-color-active)';
				document.getElementById('practice-ready-text').innerHTML = 'READY?';
			} else {
				Tiltspot.send.msg('ready', {});
				readyP = true;
				document.getElementById('practice-ready').style.backgroundColor = 'var(--driving-color)';
				document.getElementById('practice-ready-text').innerHTML = 'UNREADY';
			}
		},
		false
	);

	document.getElementById('choosing-car-ready').addEventListener(
		'click',
		function() {
			if (myColor == 'color-0' || !myColorCode) return;
			if (ready) {
				document.getElementById('choosing-car-ready-text').innerHTML = 'READY?';
				document.getElementById('choosing-car-ready-text').style.color = 'rgba(255, 255, 255, 0.7)';
				document.getElementById('choosing-row-2').style.filter = 'opacity(1)';
				document.getElementById('choosing-row-3').style.filter = 'opacity(1)';
				ready = false;

				Tiltspot.send.msg('unready');
			} else {
				document.getElementById('choosing-car-ready-text').innerHTML = 'UNREADY';
				document.getElementById('choosing-car-ready-text').style.color = 'green';
				document.getElementById('choosing-row-2').style.filter = 'opacity(0.5)';
				document.getElementById('choosing-row-3').style.filter = 'opacity(0.5)';
				ready = true;

				Tiltspot.send.msg('ready');
			}
		},
		false
	);
};
