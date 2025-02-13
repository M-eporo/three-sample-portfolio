import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OctahedronGeometry } from "three";

let scene, camera, renderer, pointLight, controls, plane, octahedro, sphere;

window.addEventListener("load", init);

function init() {
  //シーン
  scene = new THREE.Scene();

  //カメラ
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);

  //レンダラー
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  //geometry
  const sphereGeo = new THREE.SphereGeometry(0.5, 50, 50);
  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const octahedroGeo = new OctahedronGeometry(0.5);

  //texture
  const texture = new THREE.TextureLoader().load("/ocean.jpg");
  //MeshBasicMaterial
  // const material = new THREE.MeshBasicMaterial({
  //   map: texture,
  // });
  // material.side = THREE.DoubleSide;
  // material.opacity = 0.7;
  // material.transparent = true;

  //MeshNormalMaterial
  // const material = new THREE.MeshNormalMaterial();
  // material.side = THREE.DoubleSide;
  // material.flatShading = true;

  //MeshStandardMaterial
  // const material = new THREE.MeshStandardMaterial();
  // material.color.set("#049ef4");
  // material.roughness = 0.34;
  // material.metalness = 0.7;

  //MeshPhongMaterial
  const material = new THREE.MeshPhongMaterial();
  material.shininess = 1000;
  material.specular = new THREE.Color("red");

  //Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30, 50);
  pointLight.position.set(1.5, 2, 3);
  pointLight.castShadow = true;
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(pointLightHelper);

  //mesh
  sphere = new THREE.Mesh(sphereGeo, material);
  plane = new THREE.Mesh(planeGeo, material);
  octahedro = new THREE.Mesh(octahedroGeo, material);
  scene.add(sphere, plane, octahedro);

  sphere.position.x = -1.5;
  octahedro.position.x = 1.5;

  //マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}

const clock = new THREE.Clock();

function animate() {
  //回転させる
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.x = elapsedTime;
  plane.rotation.x = elapsedTime;
  octahedro.rotation.x = elapsedTime;
  sphere.rotation.y = elapsedTime;
  plane.rotation.y = elapsedTime;
  octahedro.rotation.y = elapsedTime;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
