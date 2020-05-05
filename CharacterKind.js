import Character from "./Character.js";

import { scene } from "./setup.js";

export default class CharacterKind {

  constructor(name, url) {
    this.name = name;
    this.manager = new BABYLON.SpriteManager('sprite-manager', url, 40, 500, scene);
    this.uuid = 0;
  }

  full() {
    return this.manager.sprites.length === 40;
  }

  instanciate() {
    if (this.full()) return null;
    return new Character(this, this.uuid++);
  }

}
