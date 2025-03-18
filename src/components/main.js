const scene = new THREE.Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(
  75, 
  size.width / size.height,
  0.1,
  1000
);
camera.position.set(0, 300,300);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setSize(size.width, size.height);
//renderer.setClearColor(new THREE.Color(0xffffff));
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener("resize", resizeFn);
function resizeFn() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
}

// ==== GRID ====
const grid = new THREE.GridHelper(1000,100);
//scene.add(grid);

// ==== LIGHT ====
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(ambientLight, directionalLight);

// ==== CENTER SPHERE ====
const centerSphereGeo = new THREE.SphereGeometry(100,64);
const centerSphereMate = new THREE.MeshStandardMaterial({
  color: 0x00005f,
  wireframe: true,
});
const centerSphere = new THREE.Mesh(centerSphereGeo, centerSphereMate);
scene.add(centerSphere);

// ==== CITIES SPHERE ====
const citiesPoints = [
    [35, 139],
    [51.2838, 0],
    [39, -116],
    [34, 118],
    [-33, 151],
    [-23, -46],
    [1, 103],
    [90, 0],
    [-90, 0],
];
const citiesWrap =  new THREE.Group();
scene.add(citiesWrap);

const pointSphereMate = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
for(let i = 0; i < citiesPoints.length; i++){
  const latitude = citiesPoints[i][0];
  const longitude = citiesPoints[i][1];
  const point = createPoint(latitude, longitude);
  citiesWrap.add(point);
}

// ==== LINE ====

const linesGroup = new THREE.Group();
scene.add(linesGroup);

const vertices = new Float32Array([
  0,0,0,
  200,200,0
]);
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

/*
// ==== LINE2 ====
const lineGeo2 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(-200,200,0)
]);
const line2 = new THREE.Line(
  lineGeo2,
  new THREE.LineBasicMaterial({
    color: Math.random() * 0xffffff,
  })
);
scene.add(line2);
*/

// ==== ROTATING SPHERES & LINE ====
const sphereGroup = new THREE.Group();
scene.add(sphereGroup);
const spheres = [];
let targetMesh = new THREE.Mesh();
let targetMesh2 = new THREE.Mesh();
for(let i = 0; i < 10; i++){
  const geometry = new THREE.SphereGeometry(20);
  const material = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
  });

  const mesh = new THREE.Mesh(geometry, material);
  if(i === 0){
    targetMesh = mesh;
  }else if(i === 4){
    targetMesh2 = mesh;
  }

  const radian = (i / 10) * Math.PI * 2;
  mesh.position.set(200 * Math.cos(radian), 0, 200 * Math.sin(radian));
  sphereGroup.add(mesh);
  spheres.push(mesh);

  const line = new THREE.Line(
    lineGeo,
    new THREE.LineBasicMaterial({
      color: Math.random() * 0xffffff,
    })
  );
  linesGroup.add(line);
  
}

// ==== Utils ====
function createPoint(latitude, longitude){
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(5),
    new THREE.MeshStandardMaterial({
     color: Math.random() * 0xffffff,
   }));
   mesh.position.copy(translateGeoCoords(latitude, longitude, 100));
   return mesh;
}

function translateGeoCoords(latitude = 0, longitude = 0, radius){
  const phi = latitude * (Math.PI / 180);
  const theta = longitude * (Math.PI / 180);
  const x = -1 * radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  return new THREE.Vector3(x,y,z);
}
console.log(linesGroup.children);
linesGroup.children.forEach(line => {
  console.log(line.geometry.attributes.position.array);
});
console.log(sphereGroup.children[0].getWorldPosition(new THREE.Vector3()));
function animation(){

  sphereGroup.rotation.x += 0.02;
  sphereGroup.rotation.y += 0.01;

  
  const worldPositions = [];
  for(let i = 0; i < sphereGroup.children.length; i++){
    worldPositions.push(sphereGroup.children[i].getWorldPosition(new THREE.Vector3()));
  }
  console.log(worldPositions);

  const linePositions = [];
  for(let i = 0; i < linesGroup.children.length; i++){
    linePositions.push(linesGroup.children[i].geometry.attributes.position.array);
  }
  console.log(linePositions);  

/*  for(let i = 0; i < positions.length; i++){
    positions[i][0] = 0;
    positions[i][1] = 0;
    positions[i][2] = 0;
    positions[i][3] = worldPositions[i].x;
    positions[i][4] = worldPositions[i].y;
    positions[i][5] = worldPositions[i].z;
  }
  line.geometry.attributes.position.needsUpdate = true;
  line2.geometry.attributes.position.needsUpdate = true;
*/

  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation();