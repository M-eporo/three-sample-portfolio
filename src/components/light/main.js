import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OctahedronGeometry } from "three";
import { gui } from "../../gui/lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
  1000
);
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

//アンビエントライト
const ambientLight = new THREE.AmbientLight(0xffffff, 50);
ambientLight.color = new THREE.Color(0xab2590);
ambientLight.intensity = 30;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(100).step(0.1);

//ディレクショナルライト
const directionalLight = new THREE.DirectionalLight(0x88aa00, 1);
directionalLight.position.set(1, 0.55, 0.6);
scene.add(directionalLight);

//半球光源
const hemiSphereLight = new THREE.HemisphereLight(0x0ffff0, 0xffff00, 0.5);
hemiSphereLight.position.set = (1, 0.55, 0);
scene.add(hemiSphereLight);
gui.add(hemiSphereLight.position, "x");

//Point Light
const pointLight = new THREE.PointLight(0xff4000, 0.5, 7);
pointLight.position.set(1,1,0);
scene.add(pointLight);

//RectAreaLight
const rectLight = new THREE.RectAreaLight(0x4eff00, 1, 2, 2);
rectLight.position.set(2, 0, 0);
rectLight.lookAt(0,0,0);
scene.add(rectLight);

//spot light
const spotLight = new THREE.SpotLight(0x888888, 15, 20, Math.PI * 0.2, 0.02, 1);
spotLight.position.set(0,2,3);
scene.add(spotLight);
console.log(spotLight);
spotLight.target.position.x = -1;
scene.add(spotLight.target);

//helper
const helperDirectional = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(helperDirectional);
const helperHemisphere = new THREE.HemisphereLightHelper(
  hemiSphereLight,
  0.2
);
scene.add(helperHemisphere);
const helperPointLight = new THREE.PointLightHelper(
  pointLight,
  0.4
);
scene.add(helperPointLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const helperRectAreaLight = new RectAreaLightHelper(rectLight);
scene.add(helperRectAreaLight);

//マテリアル
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;

//オブジェクト
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
