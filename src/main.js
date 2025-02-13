import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
let scene, camera, renderer, pointLight,controls;

window.addEventListener("load", init);

function init() {
  //Scene追加
  scene = new THREE.Scene();
  //Camera追加
  //PerspectiveCamera(視野角度、アスペクト比、開始距離、終了距離)
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

  //テクスチャーを追加
  const texture = new THREE.TextureLoader().load("./earth.jpg");
  //ジオメトリ作成
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  //マテリアル作成
  const ballMaterial = new THREE.MeshPhysicalMaterial({
    map: texture,
  });
  //メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);
  //マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  //平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  //平行光源の位置
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    -100,
    "red"
  );
  scene.add(directionalLightHelper);

  //ポイント光源
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  pointLight.decay = 1;
  pointLight.power = 1000;
  scene.add(pointLight);
  //ポイント光源の位置
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  window.addEventListener("resize", onWindowResize);
  animation();
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  //カメラのアスペクト比を変更
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//ポイント光源を回転させる
function animation() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );
  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}