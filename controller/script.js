var lastSentMovement = 0;

var lastSentOrientation = 0;
var myColor;
var myColorCode;
var myColorSelect;
var tempColor;
var reservedColors = [];
var ready = false;
var readyP = false;
var dead = false;
var press = false;

setTimeout(function() {
	document.getElementById('loading').style.display = 'none';
}, 1000);

var nippleSize = Math.floor(window.innerWidth * 0.2);
if (window.innerHeight > window.innerWidth) {
	nippleSize = Math.floor(window.innerHeight * 0.2);
}

var nippleManager = nipplejs.create({
	zone       : document.getElementById('touchPad'),
	multitouch : false,
	size       : nippleSize,
	fadeTime   : 0
});

nippleManager.on('move', function(evt, nipple) {
	if (new Date().getTime() - lastSentMovement > 50) {
		if (nipple.angle) Tiltspot.send.msg('move', { h: nipple.angle.radian.toFixed(2) });
		console.log(nipple.angle.radian.toFixed(2));
		lastSentMovement = new Date().getTime();
	}
});

nippleManager.on('end', function(evt) {
	lastSentMovement = 0;
});

Tiltspot.on.ready = function() {
	loadModels();
};

Tiltspot.on.msg = function(msg, data) {
	switch (msg) {
		case 'set-color':
			makeRGB(data, function() {
				findColor(rgb, function() {
					setColor(newColor);
				});
			});
			document.getElementById('choosing-car-ready-text').style.display = 'flex';
			break;
		case 'color-reserved':
			makeRGB(data, function() {
				rgbToColor(rgb, function() {
					reserveColor(tempColor);
				});
			});
			break;
		case 'color-unreserved':
			makeRGB(data, function() {
				rgbToColor(rgb, function() {
					unreserveColor(tempColor);
				});
			});
			break;
		case 'ready-query':
			Tiltspot.send.msg('ready');
			break;
		case 'ReconnectData':
			var tempState = data['state-id'];
			ready = false;
			setVisibility(tempState);
			makeRGB(data, function() {
				findColor(rgb, function() {
					setColor(newColor);
				});
			});
			document.getElementById('choosing-car-ready-text').style.display = 'flex';
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
		alert('not made yet');
	} else {
		alert('not made yet');
	}
	if (id == 6) {
		dead = false;
		document.getElementById('driving').style.display = 'flex';
	} else {
		document.getElementById('driving').style.display = 'none';
	}
}

function resetV() {
	Tiltspot.send.msg('move', { v: 0.0 });
	console.log('end');
}

function rgbToColor(color, callback) {
	switch (color) {
		case 'rgb(255,0,0)':
			tempColor = 'color-1';
			break;
		case 'rgb(0,0,255)':
			tempColor = 'color-2';
			break;
		case 'rgb(255,235,4)':
			tempColor = 'color-3';
			break;
		case 'rgb(0,255,0)':
			tempColor = 'color-4';
			break;
		case 'rgb(255,0,255)':
			tempColor = 'color-5';
			break;
		case 'rgb(0,255,255)':
			tempColor = 'color-6';
			break;
		case 'rgb(255,123,0)':
			tempColor = 'color-7';
			break;
		case 'rgb(166,0,255)':
			tempColor = 'color-8';
			break;
		default:
			console.log('none');
	}
	callback(tempColor);
}

function findColor(color, callback) {
	switch (color) {
		case 'color-1':
		case 'rgb(255,0,0)':
			myColor = 'color-1';
			myColorCode = { r: '255', g: '0', b: '0' };
			myColorSelect = 'selected-1';
			break;
		case 'color-2':
		case 'rgb(0,0,255)':
			myColor = 'color-2';
			myColorCode = { r: '0', g: '0', b: '255' };
			myColorSelect = 'selected-2';
			break;
		case 'color-3':
		case 'rgb(255,235,4)':
			myColor = 'color-3';
			myColorCode = { r: '255', g: '235', b: '4' };
			myColorSelect = 'selected-3';
			break;
		case 'color-4':
		case 'rgb(0,255,0)':
			myColor = 'color-4';
			myColorCode = { r: '0', g: '255', b: '0' };
			myColorSelect = 'selected-4';
			break;
		case 'color-5':
		case 'rgb(255,0,255)':
			myColor = 'color-5';
			myColorCode = { r: '255', g: '0', b: '255' };
			myColorSelect = 'selected-5';
			break;
		case 'color-6':
		case 'rgb(0,255,255)':
			myColor = 'color-6';
			myColorCode = { r: '0', g: '255', b: '255' };
			myColorSelect = 'selected-6';
			break;
		case 'color-7':
		case 'rgb(255,123,0)':
			myColor = 'color-7';
			myColorCode = { r: '255', g: '123', b: '0' };
			myColorSelect = 'selected-7';
			break;
		case 'color-8':
		case 'rgb(166,0,255)':
			myColor = 'color-8';
			myColorCode = { r: '166', g: '0', b: '255' };
			myColorSelect = 'selected-8';
			break;
		default:
			console.log('none');
	}
	callback((newColor = { myColor, myColorCode, myColorSelect }));
}

function setColor(color) {
	document.getElementById(color.myColorSelect).style.display = 'flex';
	document.getElementById(color.myColor).getElementsByTagName('img')[0].className = 'pulsate';
	document.getElementById('choosing-car-ready-text').style.display = 'flex';

	makeRGBA(color.myColorCode, function() {
		setControllerColor(rgba);
	});
	makeRGBA(color.myColorCode, function() {
		setTimeout(function() {
			changeColor(rgba);
		}, 100);
	});
}

function setControllerColor(color) {
	document.documentElement.style.setProperty('--driving-color', color.replace(',1)', ',0.7)'));
	document.documentElement.style.setProperty('--driving-color-active', color);
}

function reserveColor(color) {
	if (color != myColor) {
		document.getElementById(color + '-img').style.filter = 'opacity(30%)';
		document.getElementById(color + '-img').style.webkitFilter = 'opacity(30%)';
		document.getElementById(color + '-img').style.marginTop = '10px';
		document.getElementById(color + '-img').style.marginLeft = '5px';
	} else {
		document.getElementById(color + '-img').style.marginTop = '-10px';
		document.getElementById(color + '-img').style.marginLeft = '-5px';
	}
}

function unreserveColor(color) {
	document.getElementById(color + '-img').style.filter = 'opacity(100%)';
	document.getElementById(color + '-img').style.webkitFilter = 'opacity(100%)';
	document.getElementById(color + '-img').style.marginTop = '0';
	document.getElementById(color + '-img').style.marginLeft = '0';
}

function makeRGBA(colorCode, callback) {
	callback((rgba = 'rgba(' + colorCode.r + ',' + colorCode.g + ',' + colorCode.b + ',1)'));
}

function makeRGB(colorCode, callback) {
	callback((rgb = 'rgb(' + colorCode.r + ',' + colorCode.g + ',' + colorCode.b + ')'));
}

window.onload = function() {
	var colors = document.getElementsByClassName('choosing-colors');
	for (i = 0; i < colors.length; i++) {
		colors[i].addEventListener('click', function(e) {
			var colorName = document.getElementById(e.currentTarget.id);
			if (!myColor || ready) return;
			if (colorName.id == myColor) return;
			if (
				document.getElementById(colorName.id + '-img').style.filter == 'opacity(30%)' ||
				document.getElementById(colorName.id + '-img').style.webkitFilter == 'opacity(30%)'
			) {
				return;
			}

			document.getElementById(myColorSelect).style.display = 'none';
			document.getElementById(myColor).getElementsByTagName('img')[0].className = '';

			Tiltspot.send.msg('color-unreserved', myColorCode);

			findColor(e.currentTarget.id, function() {
				setColor(newColor);

				Tiltspot.send.msg('color-selected', newColor.myColorCode);
			});
		});
	}

	document.getElementById('driving-col-1').addEventListener('touchend', resetV, false);
	document.getElementById('driving-col-2').addEventListener('touchend', resetV, false);

	document.getElementById('driving-col-1').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('move', { v: -1.0 });
			console.log('reverse');
		},
		false
	);
	document.getElementById('driving-col-2').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('move', { v: 1.0 });
			console.log('forward');
		},
		false
	);

	document.getElementById('driving-row-2').addEventListener(
		'touchstart',
		function() {
			Tiltspot.send.msg('fire', {});
			console.log('fire');
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
