import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


//テクスチャ設定
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/9.png");

//Particle
  // const particleGeometry = new THREE.SphereGeometry(1, 16, 32);
  // const pointMaterial = new THREE.PointsMaterial({
  //   size: 0.01,
  //   sizeAttenuation: true,
  // });
  // const particles = new THREE.Points(particleGeometry, pointMaterial);
// scene.add(particles);
//Geometry
const particleGeometry = new THREE.BufferGeometry();
const count = 5000;

const cube = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshNormalMaterial()
)
//Material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});
// pointMaterial.color.setStyle("blue");
//Meshing
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
)

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  for (let i = 0; i < count; i++){
    const i3 = i * 3;
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + i3) * 2;
  }

  particleGeometry.attributes.position.needsUpdate = true; 
  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

animate();
