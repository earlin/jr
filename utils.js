import { scene } from "./setup.js"

export function lerp(a, b, t) { return a + (b - a) * t; }
export function random(min, max) { return lerp(min, max, Math.random()); }

export function putInsideBox(position, box) {
  const minimum = box.minimum, maximum = box.maximum;
  position.set(
    random(minimum.x, maximum.x),
    minimum.y,
    random(minimum.z, maximum.z)
  );
}

export function animation(name, property, frames, type = BABYLON.Animation.ANIMATIONTYPE_FLOAT, fps = 30) {
  const animation = new BABYLON.Animation(name, property, fps, type);
  animation.setKeys(frames.map(([frame, value]) => ({ frame, value })));
  return animation;
}

export function play(node, duration) {
  return animate(node, 0, duration);
}

export function animate(node, from, to, loop = false) {
  return scene.beginAnimation(node, from, to, loop).waitAsync();
}
