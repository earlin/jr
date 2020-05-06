import { scene } from "./setup.js"

const { Vector3, Animation } = BABYLON;

export function pickOrNull(items) { return items[(items.length + 1) * Math.random() | 0] || null; }
export function pick(items) { return items[items.length * Math.random() | 0] }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function random(min, max) { return lerp(min, max, Math.random()); }

export function tap(value) { console.log(value); return value; }

export function putRandomlyInsideBox(position, box) {
  const minimum = box.minimum, maximum = box.maximum;
  position.set(
    random(minimum.x, maximum.x),
    minimum.y,
    random(minimum.z, maximum.z)
  );
}

const vector = new Vector3();
export function putInsideBox(box, mesh, others, attempts = 30) {
  const position = mesh.position;
  outer: for (let i = 0; i < attempts; i++) {

    // console.log(i);

    putRandomlyInsideBox(vector, box);

    for (const other of others) {
      if ((mesh != other) && (Vector3.DistanceSquared(vector, other.mesh.position) <= 4)) {
        continue outer;
      }
    }
  
    position.copyFrom(vector);
    return true;

  }

  return false;

}

export function animation(name, property, frames, type = BABYLON.Animation.ANIMATIONTYPE_FLOAT, fps = 30) {
  const animation = new Animation(name, property, fps, type);
  animation.setKeys(frames.map(([frame, value]) => ({ frame, value })));
  return animation;
}

export function play(node, duration) {
  return animate(node, 0, duration);
}

export function animate(node, from, to, loop = false) {
  return scene.beginAnimation(node, from, to, loop).waitAsync();
}
