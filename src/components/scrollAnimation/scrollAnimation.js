import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  //canvas
const canvas = document.getElementById("webgl");

  //Size
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

  //Scene
const scene = new THREE.Scene();

  //背景用テクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("/bg.jpg");
scene.background = bgTexture;

  //Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  
  //Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

  //Create Object
  //Geometry
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const torusGeometry = new THREE.TorusGeometry(8,2,16,100);
  //Material
const boxMaterial = new THREE.MeshNormalMaterial();
const torusMaterial = new THREE.MeshNormalMaterial();
  //Mesh
const box = new THREE.Mesh(boxGeometry, boxMaterial);
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
box.position.set(0, 0.5, -15);
torus.position.set(0,1,10);
box.rotation.set(1,1,0);
scene.add(box, torus);

  //Mouse Operation
const controls = new OrbitControls(camera, renderer.domElement);

  //Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

  //Point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-200, -200, -200);
pointLight.decay = 1;
pointLight.power = 1000;
scene.add(pointLight);

  //Helper
const helperPointLight = new THREE.PointLightHelper(pointLight, 30);
scene.add(helperPointLight);

//Get Scroll Percentage
//document.documentElement === hmtl
let scrollPercentage = 0;
document.body.onscroll = () => {
  scrollPercentage =
    (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
  console.log(scrollPercentage);
}

//線形補間
//x=スタート位置 y=終了位置 a=滑らかに動かす割合(一次関数、二次関数)
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollPercentage - start) / (end - start);
}

  //Scroll Animation
const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 40,
  fn: function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  }
});
animationScripts.push({
  start: 40,
  end: 60,
  fn: function () {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40,60));
  },
});
animationScripts.push({
  start: 60,
  end: 80,
  fn: function () {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60,80));
    camera.position.y = lerp(1, 15, scalePercent(60,80));
    camera.position.z = lerp(10, 25, scalePercent(60,80));
  },
});
animationScripts.push({
  start: 80,
  end: 100,
  fn: function () {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
    
  },
});
function playScrollAnimation() {
  animationScripts.forEach((anime) => {
    if (scrollPercentage >= anime.start && scrollPercentage <= anime.end) {
      anime.fn();
    }
  });
}

  //requestAnimationFrame
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};
tick();
