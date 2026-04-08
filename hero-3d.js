import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const container = document.querySelector(".hero-3d");
if (!container) {
    throw new Error("Hero 3D container not found.");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 1.4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const resize = () => {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
};
resize();
window.addEventListener("resize", resize);

const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
keyLight.position.set(6, 6, 8);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xd9d9d9, 0.7);
fillLight.position.set(-6, 2, 3);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0x9aa0a6, 0.7, 30);
rimLight.position.set(-3, 4, -6);
scene.add(rimLight);

const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb7bcc2,
    metalness: 0.6,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3
});

const accentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9aa0a6,
    metalness: 0.5,
    roughness: 0.4,
    clearcoat: 0.3
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdadfe4,
    transmission: 0.45,
    thickness: 0.5,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.55
});

const group = new THREE.Group();
scene.add(group);

const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), coreMaterial);
core.rotation.set(0.2, 0.4, 0.1);
group.add(core);

const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.045, 24, 220), accentMaterial);
ringA.rotation.set(0.9, 0.1, 0.2);
group.add(ringA);

const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 24, 180), glassMaterial);
ringB.rotation.set(-0.5, 0.6, -0.1);
group.add(ringB);

const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.03, 24, 260), accentMaterial);
ringC.rotation.set(0.2, -0.2, 0.8);
group.add(ringC);

const satellites = new THREE.Group();
const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
for (let i = 0; i < 10; i += 1) {
    const cube = new THREE.Mesh(cubeGeo, glassMaterial);
    const angle = (i / 10) * Math.PI * 2;
    const radius = 2.6 + (i % 2) * 0.35;
    cube.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.7) * 0.6, Math.sin(angle) * radius);
    cube.rotation.set(angle, angle * 0.5, angle * 0.25);
    satellites.add(cube);
}
group.add(satellites);


let mouseX = 0;
let mouseY = 0;
window.addEventListener("pointermove", (event) => {
    const bounds = container.getBoundingClientRect();
    mouseX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouseY = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
});

const clock = new THREE.Clock();

const animate = () => {
    const elapsed = clock.getElapsedTime();
    const motionScale = prefersReducedMotion ? 0.2 : 1;

    group.rotation.y = elapsed * 0.22 * motionScale;
    group.rotation.x = 0.12 + Math.sin(elapsed * 0.35) * 0.04 * motionScale;
    ringA.rotation.z += 0.0022 * motionScale;
    ringB.rotation.z -= 0.0028 * motionScale;
    ringC.rotation.z += 0.0016 * motionScale;
    satellites.rotation.y -= 0.003 * motionScale;

    group.position.x = mouseX * 0.3 * motionScale;
    group.position.y = 0.15 + mouseY * 0.25 * motionScale;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();
