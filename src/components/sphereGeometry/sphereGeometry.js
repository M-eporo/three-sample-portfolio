import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, +500);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const sphereGeometry = new THREE.SphereGeometry(100, 28, 14,0,1.7278, 4.73,6.28);
  const material = new THREE.MeshNormalMaterial({
    wireframe: true
  });
  const sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);


  controls = new OrbitControls(camera, renderer.domElement);

  pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(-200, -200, -200);
  pointLight.decay = 1;
  pointLight.power = 1000;
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  window.addEventListener("resize", onWindowResize);
  animation();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
function animation() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  )
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}