import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gui } from "../../gui/lil-gui";

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
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const bufferGeometry = new THREE.BufferGeometry();
  const count = 50;
  const bufferPosition = new Float32Array(9 * count);
  for (let i = 0; i < count * 9; i++){
    bufferPosition[i] = (Math.random() - 0.5) * 2
  }

  const positionAttri = new THREE.BufferAttribute(bufferPosition, 3);
  bufferGeometry.setAttribute("position", positionAttri);

  const material = new THREE.MeshBasicMaterial({
    wireframe: true
  });

  const buffer = new THREE.Mesh(bufferGeometry, material);
  scene.add(buffer);

  const positionFolder = gui.addFolder("Position");
  positionFolder.add(buffer.position, "x").min(-3).max(3).step(0.01).name("transformX");

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