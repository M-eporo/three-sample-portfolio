import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

function init() {
  //Scene追加
  scene = new THREE.Scene();
  //Camera追加
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, +500);
  //Renderer追加
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  //boxGeometry
  const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
  //マテリアル
  const material = new THREE.MeshNormalMaterial({
    wireframe: true
  });
  //メッシュ化
  const box = new THREE.Mesh(boxGeometry, material);
  scene.add(box);
  
  //マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  //平行光源
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(1, 1, 1);
  const lightHelper = new THREE.DirectionalLightHelper(light, -100, "red");
  scene.add(light);
  //ポイント光源
  pointLight = new THREE.PointLight(0xffffff, 1);
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
  );
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
