import { scene } from "./setup.js";
import { ENTRY_OFFSET, LIGHTBULB_OFFSET, LIGHTBULB_SIZE } from "./constants.js";
import { animation, play, putInsideBox } from "./utils.js";

const {
  ElasticEase,
  SpriteManager,
  EasingFunction,
  Mesh,
  StandardMaterial,
  Sprite,
  Animation,
  Vector3,
} = BABYLON;

const zero = Vector3.Zero();
const one = Vector3.One();

const elastic = new ElasticEase(1, 0.1);
elastic.setEasingMode(EasingFunction.EASINGMODE_EASEIN);

const lightbulbs = new SpriteManager('lightbulbs', "./assets/idea.png", 120, 500, scene);

export default class Character {

  constructor(kind, uuid) {

    this.kind = kind;
    this.uuid = uuid;
    this.room = null;

    /** @type {Mesh} */
    const mesh = this.mesh = new Mesh.CreateBox("box", 2, scene);

    // mesh.receiveShadows = true;

    mesh.isVisible = false;
    // mesh.showBoundingBox = true;

    const material = mesh.material = new StandardMaterial("material", scene);

    material.diffuseColor = kind.color;

    const bulb = this.lightbulb = new Sprite("lightbulb", lightbulbs);

    bulb.size = LIGHTBULB_SIZE;
    bulb.isVisible = false;

  }

  get name() { return `${this.kind.name} #${this.uuid}`; }
  get id() { return `${this.kind.name.toLowerCase()}-${this.uuid}`; }

  async goToRoom(next) {

    const current = this.room;
    this.room = next;
    switch (state(current, next)) {
      case EnteringRoom:
        await this.enterRoom(next);
        break;
      case ExitingRoom:
        await this.leaveRoom(current);
        break;
      case MovingBetweenRoom:
        await this.moveBetweenRooms(current, next);
        break;
    }

    // console.log(this.mesh.position.toString());

  }

  async enterRoom(room) {

    const mesh = this.mesh;
    const position = mesh.position;

    if (putInsideBox(room.box, mesh, room.characters) && room.addCharacter(this)) {

      const start = position.add(ENTRY_OFFSET);

      const scale = animation(
        'scale', 'scaling',
        [
          [0, zero],
          [2, one.scale(0.5)],
          [3, one.scale(1.2)],
          [5, one]
        ],
        Animation.ANIMATIONTYPE_VECTOR3
      );

      const movement = animation(
        'movement', 'position',
        [
          [0, position],
          [3, start],
          [5, position]
        ],
        Animation.ANIMATIONTYPE_VECTOR3
      );

      mesh.animations = [scale, movement];
      mesh.isVisible = true;

      movement.setEasingFunction(elastic)

      if (this.idea) {
        await Promise.all([
          play(mesh, 5),
          this.showLightbulb(),
        ]);
      } else {
        await play(mesh, 5);
      }

    }
  }

  async leaveRoom(room) {
    if (room.deleteCharacter(this)) {

      const mesh = this.mesh;
      const position = mesh.position;

      const end = position.add(ENTRY_OFFSET);

      const scale = animation(
        'scale', 'scaling',
        [
          [0, one],
          [3, one.scale(1.5)],
          [5, zero]
        ],
        Animation.ANIMATIONTYPE_VECTOR3
      );

      const movement = animation(
        'movement', 'position',
        [
          [0, position],
          [5, end]
        ],
        Animation.ANIMATIONTYPE_VECTOR3
      );

      mesh.animations = [scale, movement];

      if (this.idea) {
        await Promise.all([
          play(mesh, 5),
          this.hideLightbulb(),
        ]);
        this.idea = true;
      } else {
        await play(mesh, 5);
      }

      mesh.isVisible = false;

    }
  }

  async moveBetweenRooms(current, next) {
    await this.leaveRoom(current);
    await this.enterRoom(next);
  }

  _updateLightbulbPosition() {
    this.lightbulb.position =
      this.mesh.position.add(LIGHTBULB_OFFSET);
  }

  async showLightbulb() {

    this.idea = true;

    const bulb = this.lightbulb;

    this._updateLightbulbPosition();

    const position = bulb.position;

    const movement = animation(
      'movement', 'position',
      [
        [0, position],
        [5, position.add(Vector3.Down())]
      ],
      Animation.ANIMATIONTYPE_VECTOR3
    );

    const size = LIGHTBULB_SIZE;
    const scale = animation(
      'scale', 'size',
      [
        [0, 0],
        [1, 0],
        [3, 1.5 * size],
        [5, size]
      ]
    );

    bulb.animations = [scale, movement];

    movement.setEasingFunction(elastic);

    bulb.isVisible = true;

    await play(bulb, 5);

    bulb.size = size;

  }

  async hideLightbulb() {

    this.idea = false;

    const bulb = this.lightbulb;
    const size = LIGHTBULB_SIZE;

    const scale = animation(
      'scale', 'size',
      [
        [0, size],
        [3, 1.5 * size],
        [5, 0]
      ]
    );

    bulb.animations = [scale];

    await play(bulb, 5);

    scale.setEasingFunction(elastic);

    bulb.isVisible = false;
    bulb.size = size;

  }

}

const ExitingRoom = 1;
const EnteringRoom = 2;
const MovingBetweenRoom = 3;

function state(from, to) {
  return (from ? ExitingRoom : 0) | (to ? EnteringRoom : 0);
}
