import "./style.css";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(50, 20, 30);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
scene.add(dirLight);

const loader = new FontLoader();
loader.load(
  '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    
     const textGeo = new TextGeometry(
      "Hello, Three.js!!", {
      font: font,
      size: 10,
      depth: 5,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 8
     });
    textGeo.computeBoundingBox();
    textGeo.center(); 
    const material = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
    });
    const text = new THREE.Mesh(textGeo, material);
    console.log(text);
    scene.add(text);
  }
);


function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
