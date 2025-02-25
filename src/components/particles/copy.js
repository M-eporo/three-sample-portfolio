import "./style.class";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/9.png");

const particleGeometry = new THREE.BufferGeometry();
const count = 500;

const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttribute: true,
  transparent: true,
  alphaMap: particleTexture,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particleGeometry, pointMaterial);
scene.add(particles);

const positionArray = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++){
  positionArray[i] = (Math.random() - 0.5) * 10;
  colorArray[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorArray, 3)
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);
const onWindowResize = () => {
  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
}

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  const i3 = i * 3;
  particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + i3) * 2;
  particleGeometry.attributes.position.needsUpdate = true;
}