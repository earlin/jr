import { scene } from "./setup.js";

const {
  Mesh,
  StandardMaterial,
  Color3,
  BoundingBox,
} = BABYLON;

export default class Room {

  constructor(name, x, y, z) {
    this.name = name;
    this.mesh = Room.mesh(x, y, z);
    this.box = Room.box(this.mesh);
    this.color = Room.color(this.mesh, new Color3(Math.random(), Math.random(), Math.random()));
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

    const material = new StandardMaterial("material", scene);
  
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
    minimum.y += 1;

    return new BoundingBox(minimum, maximum);

  }

  static mesh(x, y, z) {

    const mesh = Mesh.CreateBox('room', 10, scene).flipFaces(true);

    mesh.receiveShadows = true;

    // mesh.showBoundingBox = true;
    mesh.position.set(x, y + 5, z);

    return mesh;

  }

}