var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // it's up to you how you will create THREE.Plane(), there are several methods
var raycaster = new THREE.Raycaster(); //for reuse
var mouse = new THREE.Vector2();       //for reuse
var intersectPoint = new THREE.Vector3();//for reuse

var skull;

function init(){
  var scene = new THREE.Scene();
  var gui = new dat.GUI();

  var pointLight = getLight("directional", 1);

  pointLight.position.x = 5;
  pointLight.position.y = 12;
  pointLight.position.z = 20;

  scene.add(pointLight);

  //camera
  camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;
  //camera.lookAt(new THREE.Vector3(0,0,0));
  camera.lookAt(scene.position);

  //UI
  /*gui.add(pointLight, 'intensity', 0, 10);
	gui.add(pointLight.position, 'x', -100, 100);
	gui.add(pointLight.position, 'y', -100, 100);
	gui.add(pointLight.position, 'z', -100, 100);*/

  //load external file
  var loader = new THREE.OBJLoader();
  var textureLoader = new THREE.TextureLoader();

  loader.load('assets/skull-planes/source/Skull3D.OBJ', function(object){
    var color = textureLoader.load("assets/skull-planes/textures/SkullAO.png");
    var material = getMaterial("phong", "rgba(25,25,25)");

    object.traverse(function(child){
      //child.material = material;
      material.map = color;
      material.bumpMap = color;
      material.roughnessMap = color;
      material.metalness = 0;
      material.bumpScale = 0.175;
    });

    object.castShadow = true;
    object.position.y = .2;
    object.position.z = 0.2;
    object.scale.x = .5;
    object.scale.y = .5;
    object.scale.z = .5;

    //object.rotation.y = toRadians(180);

    skull = object;

    scene.add(skull);

    window.addEventListener('mousemove', onMouseMove, false);
  });

  //renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(0, 0, 0)');
	document.getElementById('webgl').appendChild(renderer.domElement);

  update(renderer, scene, camera);

  return scene;
}

function toRadians(angle){
	return angle * (Math.PI / 180);
}

function getPlane(size){
  var geometry = new THREE.PlaneGeometry(size,size);
  var material = new THREE.MeshBasicMaterial({
    color: 'rgb(255,0,0)',
    side: THREE.DoubleSide
  })
  var plane = new THREE.Mesh(geometry, material);
  return plane;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}
	return selectedMaterial;
}

function getLight(type, intensity){
  switch (type) {
    case "point":
      var light = new THREE.PointLight(0xFFFFFF,intensity);
      break;
    case "spotlight":
      var light = new THREE.SpotLight(0xFFFFFF, intensity);
      break;
    case "directional":
      var light = new THREE.DirectionalLight(0xFFFFFF, intensity);
      break;
    case "ambient":
      var light = new THREE.AmbientLight(0xFFFFFF, intensity);
      break;
    default:
      var light = new THREE.PointLight(0xFFFFFF,intensity);
      break;
  }

  light.castShadow = true;
  return light;

}

function onMouseMove(event) {
  //get mouse coordinates
  mouse.x = -(event.clientX / window.innerWidth) * 2 + 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  raycaster.setFromCamera(mouse, camera);//set raycaster
  raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection
  skull.lookAt(intersectPoint); // face our arrow to this point
};

function update(renderer, scene, camera){
  //controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(function() {
		update(renderer, scene, camera);
	});
}

var scene = init();
