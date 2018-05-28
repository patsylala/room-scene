var width = window.innerWidth,
    height = window.innerHeight;

// Create a renderer and add it to the DOM.
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
// Create the scene
var scene = new THREE.Scene();

renderer.setSize(width, height);
renderer.setClearColor( 0xffffff, 1 );

// Create a camera
var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
camera.position.set(0,0,11);
scene.add(camera);

// // Add axes
// var axes = new THREE.AxisHelper(50);
// scene.add(axes);

// day scene
scene.fog = new THREE.FogExp2( 0xffffff, 0.007 );
scene.fog.density = 0.048;

var sunlight = new THREE.DirectionalLight( 0xffffff, 1 );
sunlight.position.set( 2, 30, 2 ); 			//default; light shining from top
sunlight.castShadow = true;            // default false
scene.add( sunlight );

var frontlight = new THREE.PointLight( 0xffffff, 3);
frontlight.position.set( 0, 0, 100 );
frontlight.castShadow = false;
scene.add( frontlight );

//Set up shadow properties for the light
sunlight.shadow.mapSize.width = 2048;  // default
sunlight.shadow.mapSize.height = 2048; // default
sunlight.shadow.camera.near = 1;    // default
sunlight.shadow.camera.far = 200;     // default

var ambientLight = new THREE.AmbientLight( 0xfbcccc, 1 );
scene.add( ambientLight );

//night scene
// var spotLight = new THREE.SpotLight( 0xffffff, 2, 4 );
// spotLight.position.set( -0.7, 1.2, -1.25 );
// spotLight.target.position.set(-0.8,-5,-1.5);
// spotLight.castShadow = true;
// spotLight.decay = 1;
// spotLight.target.updateMatrixWorld();
//
// spotLight.shadow.mapSize.width = 2048;
// spotLight.shadow.mapSize.height = 2048;
// spotLight.shadow.camera.near = 30;
// spotLight.shadow.camera.far = 100;
// spotLight.angle = .70;
//
// scene.add( spotLight );
//
// var spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );
//
// var ambientLightNight = new THREE.AmbientLight( 0x1654d2, 1 );
// scene.add( ambientLightNight );
//
// scene.fog = new THREE.FogExp2( 0x42567f, 0.007 );
// scene.fog.density = 0.058;

//load mesh
var mesh = null;
var plant = null;
var cat = null;
var plantClip = null;
var plantAction = null;
var plantMixer = null;
var catClip = null;
var catAction = null;
var catMixer = null;
var clock = new THREE.Clock();
var loader = new THREE.JSONLoader();

loader.load('plants.json', function(geometry, materials) {

  for ( var i = 0; i < materials.length; i ++ ) {
  	var m = materials[ i ];
  	m.morphTargets = true;
  }

  plant = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

	plantClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'plantmovement', plant.geometry.morphTargets, 1 );
  plantMixer = new THREE.AnimationMixer( plant );
  plantAction = plantMixer.clipAction( plantClip, plant );
  scene.add(plant);

  plant.castShadow = true;
  plant.receiveShadow = true;

  plantAction.play();

  resize();
  animate();
});

loader.load('cat.json', function(geometry, materials) {

  for ( var i = 0; i < materials.length; i ++ ) {
  	var m = materials[ i ];
  	m.morphTargets = true;
  }

  cat = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

	catClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'catmovement', cat.geometry.morphTargets, 1 );
  catMixer = new THREE.AnimationMixer( cat );
  catAction = catMixer.clipAction( catClip, cat );
  scene.add(cat);

  cat.castShadow = true;
  cat.receiveShadow = true;

  catAction.play();

});

loader.load('scene-object-test-no-plants.json', function(geometry, materials) {

  mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
  scene.add(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  camera.lookAt(mesh.position);

});

window.addEventListener('resize', resize);

function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = 2 * Math.atan( ( window.innerWidth / ( w / h ) ) / ( 3000 ) ) * ( 180 / Math.PI );
  camera.updateProjectionMatrix();
}

document.addEventListener('click', onDocumentMouseClick, false);
var orange = false;

function onDocumentMouseClick() {
  if (!orange) {
    tween.start();
  } else tween3.start();

}

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// Renders the scene
function animate(time) {

  requestAnimationFrame(animate);

  TWEEN.update(time);

  render();

}

function render() {
  var delta = 0.75 * clock.getDelta();
  plantMixer.update(delta);
  catMixer.update(delta);
  camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  controls.update();
}

var coords = { x: 0, z: 11 };
var rot = 11;
var rot2 = 21.992;
var rot3 = -11;
var rot4 = 0;

function solveForX(x,z,rot) {
  return x * Math.cos(rot) + z * Math.sin(rot);
}

function solveForZ(x,z,rot) {
  return z * Math.cos(rot) - x * Math.sin(rot);
}

var tween = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot), z: solveForZ(coords.x, coords.z, rot) }, 2000)
  .easing(TWEEN.Easing.Cubic.In)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween2 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot2), z: solveForZ(coords.x, coords.z, rot2) }, 3000)
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = true;
  });

var tween3 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot3), z: solveForZ(coords.x, coords.z, rot3) }, 2000)
  .easing(TWEEN.Easing.Cubic.In)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween4 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot4), z: solveForZ(coords.x, coords.z, rot4) }, 3000)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = false;
  });

  tween.chain(tween2);
  tween3.chain(tween4);
