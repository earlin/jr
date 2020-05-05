import { ENABLE_CAMERA_CONTROL, DEG } from "./constants.js"

function deg(rad) { return rad * DEG; }

const {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
} = BABYLON;

export const canvas = document.querySelector("canvas");

export const engine = new Engine(canvas, false);
export const scene = new Scene(engine);

// scene.clearColor.set(0.2, 0.2, 0.2, 1);

export const camera = new ArcRotateCamera('camera', deg(45), deg(45), 50, new Vector3(0, 0, 0), scene);

if (ENABLE_CAMERA_CONTROL) {
  camera.attachControl(canvas, false, true);
}

export const lights = [

  new HemisphericLight('sun', Vector3.Up(), scene),

];

engine.runRenderLoop(() => {
  scene.render();
})
