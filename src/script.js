import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as lil from "lil-gui";

/**
 * Debug
 */
const gui = new lil.GUI({ width: 400 });
gui.open(false);

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

let ruota = false;

const parameters = {
  ruota: () => {
    ruota = !ruota;
  },
  spin: () => {
    if (ruota) {
      ruota = !ruota;
      gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 4 });
      setTimeout(() => {
        ruota = !ruota;
      }, 1000);
    }
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 4 });
  },
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// Data BoxGeometry
const meshData = {
  width: 1,
  height: 1,
  depth: 1,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1,
};

const geometry = new THREE.BoxGeometry(
  meshData.width,
  meshData.height,
  meshData.depth,
  meshData.widthSegments,
  meshData.heightSegments,
  meshData.depthSegments
);
const material = new THREE.MeshBasicMaterial({ color: 0x982abc });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Position GUI
const meshPositionFolder = gui.addFolder("Posizioni Cubo");
meshPositionFolder.open(false);
meshPositionFolder
  .add(mesh.position, "x")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("asse orizzontale");
meshPositionFolder
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("asse verticale");
meshPositionFolder
  .add(mesh.position, "z")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("asse trasversale");

// Function Segments BoxGeometry
const regenerateBoxGeometry = () => {
  const newGeometry = new THREE.BoxGeometry(
    meshData.width,
    meshData.height,
    meshData.depth,
    meshData.widthSegments,
    meshData.heightSegments,
    meshData.depthSegments
  );
  mesh.geometry.dispose();
  mesh.geometry = newGeometry;
};

// Dimension GUI
const meshDimensionFolder = gui.addFolder("Dimensioni Cubo");
meshDimensionFolder.open(false);
meshDimensionFolder
  .add(geometry.parameters, "width")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.width = value;
    regenerateBoxGeometry();
  });
meshDimensionFolder
  .add(geometry.parameters, "height")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.height = value;
    regenerateBoxGeometry();
  });
meshDimensionFolder
  .add(geometry.parameters, "depth")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.depth = value;
    regenerateBoxGeometry();
  });

// Segments GUI
const meshSegmentsFolder = gui.addFolder("Segmenti Cubo");
meshSegmentsFolder.open(false);
meshSegmentsFolder
  .add(geometry.parameters, "widthSegments")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.widthSegments = value;
    regenerateBoxGeometry();
  });
meshSegmentsFolder
  .add(geometry.parameters, "heightSegments")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.heightSegments = value;
    regenerateBoxGeometry();
  });
meshSegmentsFolder
  .add(geometry.parameters, "depthSegments")
  .min(1)
  .max(10)
  .step(1)
  .onChange((value) => {
    meshData.depthSegments = value;
    regenerateBoxGeometry();
  });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Camera GUI
const cameraPositionFolder = gui.addFolder("Posizione Camera");
cameraPositionFolder.open(false);
cameraPositionFolder
  .add(camera.position, "z")
  .min(3)
  .max(10)
  .step(0.01)
  .name("asse trasversale");

// Visibility GUI
gui.add(mesh, "visible").name("Visibilità");

// Wireframe GUI
gui.add(material, "wireframe").name("Wireframe");

// Color GUI
gui.addColor(material, "color").name("Colore");

// Spin cube
gui.add(parameters, "spin").name("Spin");
gui.add(parameters, "ruota").name("Ruota");

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  if (ruota) {
    mesh.rotation.y = elapsedTime;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
