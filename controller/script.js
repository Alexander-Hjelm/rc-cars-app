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
			var tempState = data['state-id']; //BYTTE
			setVisibility(tempState);
			if (tempState == 4) {
				//set car, 'car-id' : <integer>,
			} else if (tempState == 5 || tempState == 6) {
				//set powerup, 'active-powerup-id' : <integer>,
				setControllerColor('rgba(' + data['color-r'] + ', ' + data['color-g'] + ', ' + data['color-b'] + ', ');
			}
			//Set color 'color-r' : <integer>, 'color-g' : <integer>, 'color-b' : <integer></integer>
			break;
		case 'defeated-round':
			dead = true;
			document.getElementById('driving-defeated-round').style.display = flex;
			break;
		case 'round-restart':
			dead = false;
			document.getElementById('driving-defeated-round').style.display = none;
			break;
		case 'defeated-game':
			document.getElementById('driving-defeated-game').style.display = flex;
			break;
		case 'state-id': //var update-state
			setVisibility(data['state-id']); //BYTTE
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
	}

	if (msg == 'color-reserved') {
		if (myColor == temp) return;
		document.getElementById(temp).style.filter = 'grayscale(0.9)';
	} else if (msg == 'color-unreserved') {
		document.getElementById(temp).style.filter = 'grayscale(0)';
	}
}

function resetV() {
	Tiltspot.send.msg('move', { v: 0.0 });
}

function handleOrientationEvent(orientation) {
	if (lastSentOrientation + 100 < new Date().getTime() && !dead && (ready || readyP)) {
		lastSentOrientation = new Date().getTime();
		var steer = (orientation.accelerationIncludingGravity.y / 5 * 0.7).toFixed(2);

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

window.onload = function() {
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
		'click',
		function() {
			Tiltspot.send.msg('fire', {});
		},
		false
	);

	document.getElementById('practice-ready').addEventListener(
		'click',
		function() {
			if (readyP) {
				Tiltspot.send.msg('unready', {});
				readyP = false;
				document.getElementById('practice-ready').style.color = 'gray';
				document.getElementById('practice-ready').innerHTML = 'READY?';
			} else {
				Tiltspot.send.msg('ready', {});
				readyP = true;
				document.getElementById('practice-ready').style.color = 'green';
				document.getElementById('practice-ready').innerHTML = 'READY';
			}
		},
		false
	);

	document.getElementById('choosing-car-ready').addEventListener(
		'click',
		function() {
			if (ready) {
				document.getElementById('choosing-car-ready-text').innerHTML = 'READY?';
				document.getElementById('choosing-car-ready-text').style.color = 'rgba(255, 255, 255, 0.7)';
				document.getElementById('choosing-row-2').style.filter = 'opacity(1)';
				document.getElementById('choosing-row-3').style.filter = 'opacity(1)';
				ready = false;

				Tiltspot.send.msg('unready');
			} else {
				document.getElementById('choosing-car-ready-text').innerHTML = 'READY';
				document.getElementById('choosing-car-ready-text').style.color = 'green';
				document.getElementById('choosing-row-2').style.filter = 'opacity(0.5)';
				document.getElementById('choosing-row-3').style.filter = 'opacity(0.5)';
				ready = true;

				Tiltspot.send.msg('ready');
			}
		},
		false
	);

	var colors = document.getElementsByClassName('choosing-colors');
	for (i = 0; i < colors.length; i++) {
		colors[i].addEventListener('click', function(e) {
			document.getElementById('choosing-car-ready-text').style.display = 'flex';
			var temp = document.getElementById(e.currentTarget.id);

			if (document.getElementById(temp.id).style.filter == 'grayscale(0.9)' || ready) return;

			if (myColor != 'color-0') {
				document.getElementById('selected-' + myColor.split('-').pop()).style.display = 'none';
				document.getElementById(myColor).getElementsByTagName('img')[0].className -= 'pulsate';
			}

			if (myColorCode) Tiltspot.send.msg('color-unreserved', myColorCode);

			switch (e.currentTarget.id) {
				case 'color-1':
					myColorCode = { r: '255', g: '0', b: '0' };
					setControllerColor('rgba(255, 0, 0, ');
					document.getElementById('selected-1').style.display = 'flex';
					changeColor(0xff0000);
					break;
				case 'color-2':
					myColorCode = { r: '0', g: '26', b: '255' };
					setControllerColor('rgba(0, 26, 255, ');
					document.getElementById('selected-2').style.display = 'flex';
					changeColor(0x001aff);
					break;
				case 'color-3':
					myColorCode = { r: '255', g: '224', b: '0' };
					setControllerColor('rgba(255, 224, 0, ');
					document.getElementById('selected-3').style.display = 'flex';
					changeColor(0xffe000);
					break;
				case 'color-4':
					myColorCode = { r: '25', g: '255', b: '0' };
					setControllerColor('rgba(25, 255, 0, ');
					document.getElementById('selected-4').style.display = 'flex';
					changeColor(0x19ff00);
					break;
				case 'color-5':
					myColorCode = { r: '255', g: '0', b: '239' };
					setControllerColor('rgba(255, 0, 239, ');
					document.getElementById('selected-5').style.display = 'flex';
					changeColor(0xff00ef);
					break;
				case 'color-6':
					myColorCode = { r: '0', g: '250', b: '255' };
					setControllerColor('rgba(0, 250, 255, ');
					document.getElementById('selected-6').style.display = 'flex';
					changeColor(0x00faff);
					break;
				case 'color-7':
					myColorCode = { r: '255', g: '123', b: '0' };
					setControllerColor('rgba(255, 123, 0, ');
					document.getElementById('selected-7').style.display = 'flex';
					changeColor(0xff7b00);
					break;
				case 'color-8':
					myColorCode = { r: '166', g: '0', b: '255' };
					setControllerColor('rgba(166, 0, 255, ');
					document.getElementById('selected-8').style.display = 'flex';
					changeColor(0xa600ff);
					break;
				default:
					console.log('none');
			}

			myColor = temp.id;

			document.getElementById(myColor).getElementsByTagName('img')[0].className += 'pulsate';
			document.getElementById('selected-' + myColor.split('-').pop()).style.display = 'flex';
			Tiltspot.send.msg('color-selected', myColorCode);
		});
	}
};
