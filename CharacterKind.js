import Character from "./Character.js";

export default class CharacterKind {

  constructor(name, color) {
    this.name = name;
    this.color = BABYLON.Color3.FromHexString(color);
    this.uuid = 0;
  }

  full() {
    return this.uuid === 8;
  }

  instanciate() {
    if (this.full()) return null;
    return new Character(this, this.uuid++);
  }

}
