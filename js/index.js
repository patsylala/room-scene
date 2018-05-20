var width = window.innerWidth,
    height = window.innerHeight;

// Create a renderer and add it to the DOM.
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
// Create the scene
var scene = new THREE.Scene();
//Fog
scene.fog = new THREE.FogExp2( 0xffffff, 0.007 );
scene.fog.density = 0.065;

renderer.setSize(width, height);
renderer.setClearColor( 0xffffff, 1 );
// Create a camera
var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
camera.position.z = 8;

scene.add(camera);

// Create a light, set its position, and add it to the scene.
var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 2, 30, -1 ); 			//default; light shining from top
light.castShadow = true;            // default false
scene.add( light );

// var lightfront = new THREE.DirectionalLight( 0xffffff, 2 );
// lightfront.position.set( 2, 30, 10 ); 			//default; light shining from top
// lightfront.castShadow = false;            // default false
// scene.add( lightfront );

//Set up shadow properties for the light
light.shadow.mapSize.width = 2048;  // default
light.shadow.mapSize.height = 2048; // default
light.shadow.camera.near = 5;    // default
light.shadow.camera.far = 200;     // default

var light2 = new THREE.AmbientLight( 0xfbcccc, 1 );
scene.add( light2 );

// var bulblight = new THREE.PointLight( 0xff0000, .04, 0.04);
// light.position.set( 50, 50, 50 );
// scene.add( light );
//
// var lightHelper1 = new THREE.PointLightHelper( bulblight );
// scene.add( lightHelper1 );

// var lightHelper = new THREE.DirectionalLightHelper( light );
// scene.add( lightHelper );
//
// // Add axes
// var axes = new THREE.AxisHelper(50);
// scene.add(axes);

//load mesh
var mesh = null;
var floor = null;
var loader = new THREE.JSONLoader();

loader.load('scene-object-test.json', function(geometry, materials) {
  mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
  scene.add(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  camera.position.set(0,0,10);
  camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  resize();
  animate();
});

var controls = new THREE.OrbitControls(camera, renderer.domElement);

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

// Renders the scene
function animate(time) {

  requestAnimationFrame(animate);
  TWEEN.update(time);

  camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  controls.update();

}

var coords = { x: 0, z: 10 }; // Start at (0, 10)
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

var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
  .to({ x: solveForX(coords.x, coords.z, rot), z: solveForZ(coords.x, coords.z, rot) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Cubic.In) // Use an easing function to make the animation smooth.
  .onUpdate(function() { // Called after tween.js updates 'coords'.
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween2 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot2), z: solveForZ(coords.x, coords.z, rot2) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = true;
  });

var tween3 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
  .to({ x: solveForX(coords.x, coords.z, rot3), z: solveForZ(coords.x, coords.z, rot3) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Cubic.In) // Use an easing function to make the animation smooth.
  .onUpdate(function() { // Called after tween.js updates 'coords'.
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween4 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot4), z: solveForZ(coords.x, coords.z, rot4) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = false;
  });

  tween.chain(tween2);
  tween3.chain(tween4);
