var width = window.innerWidth,
    height = window.innerHeight;

// Create a renderer and add it to the DOM.
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0x000);
document.body.appendChild(renderer.domElement);
// Create the scene
var scene = new THREE.Scene();
// Create a camera
var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
camera.position.z = 8;

scene.add(camera);

// Create a light, set its position, and add it to the scene.

var light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
scene.add(light);

var light2 = new THREE.PointLight(0xffffff);
light2.position.set(0, 0, 100);
scene.add(light2);

// Add OrbitControls so that we can pan around with the mouse.
//var controls = new THREE.OrbitControls(camera, renderer.domElement);

// Add axes
var axes = new THREE.AxisHelper(50);
scene.add(axes);

//load mesh
var mesh = null;
var loader = new THREE.JSONLoader();
loader.load('scene.json', function(geometry, materials) {
  mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
  scene.add(mesh);
  camera.position.set(0,0,10);
  camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  resize();
  turnWall();
});

window.addEventListener('resize', resize);

function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
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
function turnWall(time) {

  requestAnimationFrame(turnWall);
  TWEEN.update(time);

  camera.lookAt(mesh.position);
  renderer.render(scene, camera);

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
  .easing(TWEEN.Easing.Back.In) // Use an easing function to make the animation smooth.
  .onUpdate(function() { // Called after tween.js updates 'coords'.
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween2 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot2), z: solveForZ(coords.x, coords.z, rot2) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Back.Out)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = true;
  });

var tween3 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
  .to({ x: solveForX(coords.x, coords.z, rot3), z: solveForZ(coords.x, coords.z, rot3) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Back.In) // Use an easing function to make the animation smooth.
  .onUpdate(function() { // Called after tween.js updates 'coords'.
      camera.position.x = coords.x;
      camera.position.z = coords.z;
  });
var tween4 = new TWEEN.Tween(coords)
  .to({ x: solveForX(coords.x, coords.z, rot4), z: solveForZ(coords.x, coords.z, rot4) }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Back.Out)
  .onUpdate(function() {
      camera.position.x = coords.x;
      camera.position.z = coords.z;
      orange = false;
  });

  tween.chain(tween2);
  tween3.chain(tween4);
