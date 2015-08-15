var scene, camera, controls, renderer, light;
var alpha = 0.000;
var mousePos = {};
var boxLoc = [];
var boxCount = 0;
var REGION_SCALE = 50;
var slow = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

  try{
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1);
  }
  catch(e){
    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0x000000, 1);
  }

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement ); //apply renderer to body

  light = new THREE.DirectionalLight( 0xFFFFFF );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  light = new THREE.AmbientLight( 0x424242 );
  scene.add( light );
  camera.position.z =  0;

  $('body').mousemove(function(e){
    move(e.pageX, e.pageY);
  });

  //document.addEventListener( 'mousemove', move, false );
  window.addEventListener( 'resize', onWindowResize, false );
  render();
}
//add objects to the space
function create( n ) {
  alpha += 0.0005;
  var frame = new THREE.BoxGeometry(1,1,1);
  var texture = new THREE.MeshLambertMaterial( {map:THREE.ImageUtils.loadTexture('media/bubble.jpg')} );
  texture.map.needsUpdate = true;
  for (var i = 0; i < (n * 8); i++){
    var box = new THREE.Mesh(frame, texture);
    var x = box.position.x = (0.5 - Math.random()) * REGION_SCALE;
    var y = box.position.y = (0.5 - Math.random()) * REGION_SCALE;
    var z = box.position.z = (0.5 - Math.random()) * REGION_SCALE;
    boxLoc.push(box.position);
    box.rotation.x = Math.random() * 90;
    box.rotation.y = Math.random() * 90;
    box.rotation.z = Math.random() * 90;
    scene.add(box);
    boxCount++;
  }
}

function connect( n ){
  var x1, y1, z1;
  var x2, y2, z2;
  var index;
  var material = new THREE.LineBasicMaterial({color:0x5CA0FF, linewidth:3});
  var geometry = new THREE.Geometry();

  if(boxLoc.length > 1){
    for( var i = 0; i < n; i++ ){
      index = Math.ceil(Math.random() * boxCount); //select random box
      x1 = parseFloat(boxLoc[index].x);
      x2 = parseFloat(boxLoc[index - 1].x);

      y1 = parseFloat(boxLoc[index].y);
      y2 = parseFloat(boxLoc[index - 1].y);

      z1 = parseFloat(boxLoc[index].z);
      z2 = parseFloat(boxLoc[index - 1].z);

      var st = new THREE.Vector3(x1, y1, z1);
      var nd = new THREE.Vector3(x2, y2, z2);
      geometry.vertices.push(st, nd);
      var line = new THREE.Line(geometry, material);
      scene.add( line );
    }
  }
}

function post( msg ){
  var text_canvas = document.createElement('canvas');
  var text_context = text_canvas.getContext('2d');
  text_context.font = "20px sans-serif";
  text_context.fillStyle(255,255,255,1.0);
  text_context.fillText( msg, 0, 50 );
  var texture1 = new THREE.Texture(text_canvas);
  texture1.needsUpdate = true;
  var material = new THREE.SpriteCanvasMaterial({map: texture1});
  material.transparent=true;
}

function move( x, y ) { //update to use Orbital
  //change to move the camera based on mouse
  if(mousePos.x){
    camera.rotation.y += (x - mousePos.x) / 100;
    camera.rotation.x += (y - mousePos.y) / 100;
  }
  mousePos.x = x;
  mousePos.y = y;
}

function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
  if($('#info-panel').hasClass('hide') && alpha > .0001){
    camera.rotation.x += alpha;
    camera.rotation.y += alpha;
  }
  if(slow == true) { alpha /= 1.01; }
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
