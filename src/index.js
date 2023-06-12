import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// assets
import Earth from './assets/earth2.jpg';
import Space from './assets/space.jpg';
import XrView from './assets/xr_view.jpg';

const renderer = new THREE.WebGLRenderer();

const textureLoader = new THREE.TextureLoader();

// Shadow Map
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Creating a scene
const scene = new THREE.Scene();
scene.background = textureLoader.load(Space);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Axes Helpers
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);

// Creating a box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.y = 1;

// Creating a plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// Grid Helpers
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// Add sphere class
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(Earth),
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

// // Set up directional light shadow properties
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.bias = -0.001;

// // Set up directional light shadow properties for the helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);
const dShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.castShadow = true;
spotLight.angle = 0.203;
scene.add(spotLight);
const hSpotLight = new THREE.SpotLightHelper(spotLight);
spotLight.position.set(-100, 100, 0);
scene.add(hSpotLight);

// GUI toolbar
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
};

// gui.addColor(options, 'sphereColor').onChange(function (e) {
//     sphere.material.color.set(e);
// });
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);

const lightColorOptions = {
    ambientLightColor: '#333333',
    directionalLightColor: '#ffffff',
};
gui.addColor(lightColorOptions, 'ambientLightColor').onChange((e) => {
    ambientLight.color.set(e);
});
gui.addColor(lightColorOptions, 'directionalLightColor').onChange((e) => {
    directionalLight.color.set(e);
});

const spotLightOptions = {
    angle: 0.203,
    penumbra: 0,
    intensity: 1
}

const spotLightFolder = gui.addFolder('SpotLight');
spotLightFolder.add(spotLightOptions, 'angle', 0, 1);
spotLightFolder.add(spotLightOptions, 'penumbra', 0, 1);
spotLightFolder.add(spotLightOptions, 'intensity', 0, 1);
spotLightFolder.open();

const helpersFolder = gui.addFolder('Helpers');
helpersFolder.add(dLightHelper, 'visible').name('Directional Light Helper');
helpersFolder.add(dShadowHelper, 'visible').name('Directional Light Shadow Helper');
helpersFolder.add(hSpotLight, 'visible').name('SpotLight Helper');

const BoxFolder = gui.addFolder('Box');
BoxFolder.add(box.rotation, 'x', 0, Math.PI * 2);
BoxFolder.add(box.rotation, 'y', 0, Math.PI * 2);
BoxFolder.add(box.rotation, 'z', 0, Math.PI * 2);
BoxFolder.open();

let step = 0;
function animate() {
    // Box animation
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    // Sphere animation
    step += options.speed;
    sphere.position.z = 10 * Math.abs(Math.cos(step));
    sphere.position.y = 10 * Math.abs(Math.cos(step));
    sphere.rotation.z = 10 * Math.abs(Math.cos(step));

    // spot light
    spotLight.angle = spotLightOptions.angle;
    spotLight.penumbra = spotLightOptions.penumbra;
    spotLight.intensity = spotLightOptions.intensity;
    hSpotLight.update();


    // Render animation
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
