var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ alpha: true });
var loader = new THREE.STLLoader();
var car;
var material;
var carHasBeenInitiated = false;

window.onresize = function() {
	if (!carHasBeenInitiated && isLandscape()) loadModels();
};

function isLandscape() {
	return window.innerHeight < window.innerWidth;
}

function loadModels() {
	if (!carHasBeenInitiated && isLandscape()) {
		carHasBeenInitiated = true;

		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('model').appendChild(renderer.domElement);

		var tempUrl = Tiltspot.get.assetUrl('models/rc-car.stl');
		loader.load(tempUrl, function(geometry) {
			if (geometry.hasColors) {
				material = new THREE.MeshPhongMaterial({
					opacity      : geometry.alpha,
					vertexColors : THREE.VertexColors
				});
			} else {
				console.log('ingen geometry farge farge');
				material = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
			}

			car = new THREE.Mesh(geometry, material);
			car.castShadow = true; //default is false
			car.receiveShadow = false; //default

			var tempColor = window
				.getComputedStyle(document.documentElement)
				.getPropertyValue('--driving-color-active');
			console.log(tempColor);
			car.material.color.set(tempColor);

			scene.add(car);
		});

		//Create a PointLight and turn on shadows for the light
		var light = new THREE.PointLight(0xffffff, 1, 100);
		light.position.set(0, 1, 10);
		light.castShadow = true; // default false
		scene.add(light);

		camera.position.z = 10;
		animate(camera);
	}
}

function animate(camera) {
	requestAnimationFrame(function() {
		animate(camera);
	});
	if (car) car.rotation.z += 0.01;
	if (car) car.rotation.x = -1;
	if (car) car.position.y = 2;
	renderer.render(scene, camera);
}

function changeColor(color) {
	if (car) car.material.color.set(color);
}
