import { scene } from "./setup.js";

export default class Room {

  constructor(name, x, y, z) {
    this.name = name;
    this.mesh = Room.mesh(x, y, z);
    this.box = Room.box(this.mesh);
    this.color = Room.color(this.mesh, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
    this.characters = new Set();
  }

  addCharacter(character) {
    const characters = this.characters;
    if (characters.has(character)) return false;
    characters.add(character);
    return true;
  }

  deleteCharacter(character) {
    const characters = this.characters;
    if (!characters.has(character)) return false;
    characters.delete(character);
    return true;
  }

  static color(mesh, color) {

    const material = new BABYLON.StandardMaterial("material", scene);
  
    material.diffuseColor = color;

    mesh.material = material;

    return color.toHexString();

  }

  static box(mesh) {

    const bounds = mesh.getBoundingInfo().boundingBox;
    const position = mesh.position;

    const minimum = bounds.minimum.add(position);
    const maximum = bounds.maximum.add(position);

    minimum.x += 1; minimum.z += 1;
    maximum.x -= 1; maximum.z -= 1;
    minimum.y += 2;

    return new BABYLON.BoundingBox(minimum, maximum);

  }

  static mesh(x, y, z) {

    const mesh = BABYLON.Mesh.CreateGround('room', 10, 10, 0, scene);

    // mesh.showBoundingBox = true;
    mesh.position.set(x, y, z);

    return mesh;

  }

}