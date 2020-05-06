import { scene } from "./setup.js";
import { ENTRY_OFFSET, LIGHTBULB_OFFSET } from "./constants.js";
import { animation, play, putInsideBox } from "./utils.js";

const elastic = new BABYLON.ElasticEase(1, 0.1);
elastic.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

const lightbulbs = new BABYLON.SpriteManager('lightbulbs', "./assets/idea.png", 120, 500, scene);

export default class Character {

  constructor(kind, uuid) {

    this.kind = kind;
    this.uuid = uuid;
    this.room = null;

    this.idea = false;

    const sprite = this.sprite = new BABYLON.Sprite("sprite", kind.manager);
    const bulb = this.lightbulb = new BABYLON.Sprite("lightbulb", lightbulbs);

    sprite.size = 4;
    sprite.isVisible = false;

    bulb.size = 2;
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
  }

  async enterRoom(room) {
    if (room.addCharacter(this)) {

      const sprite = this.sprite;
      const position = sprite.position;

      putInsideBox(position, room.box);

      const start = position.add(ENTRY_OFFSET);
      const size = sprite.size;

      const scale = animation(
        'scale', 'size',
        [
          [0, 0.5 * size],
          [3, 1.2 * size],
          [5, size]
        ]
      );

      const movement = animation(
        'movement', 'position',
        [
          [0, position],
          [3,    start],
          [5, position]
        ],
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3
      );

      sprite.animations = [scale, movement];
      sprite.isVisible = true;

      
      movement.setEasingFunction(elastic)
      
      if (this.idea) {
        await Promise.all([
          play(sprite, 5),
          this.showLightbulb(),
        ]);
      } else {
        await play(sprite, 5);
      }

    }
  }

  async leaveRoom(room) {
    if (room.deleteCharacter(this)) {

      const sprite = this.sprite;
      const position = sprite.position;
      const size = sprite.size;

      const end = position.add(ENTRY_OFFSET);

      const scale = animation(
        'scale', 'size',
        [
          [0,       size],
          [3, 1.5 * size],
          [5, 0]
        ]
      );

      const movement = animation(
        'movement', 'position',
        [
          [0, position],
          [5, end]
        ],
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3
      );

      sprite.animations = [scale, movement];

      sprite.animations = [scale];

      await play(sprite, 5);

      sprite.isVisible = false;
      
      if (this.idea) {
        await Promise.all([
          play(sprite, 5),
          this.hideLightbulb(),
        ]);
        this.idea = true;
      } else {
        await play(sprite, 5);
      }

      await Promise.resolve();

      sprite.size = size;

    }
  }

  async moveBetweenRooms(current, next) {
    await this.leaveRoom(current);
    await this.enterRoom(next);
  }

  _updateLightbulbPosition() {
    this.lightbulb.position =
      this.sprite.position.add(LIGHTBULB_OFFSET);
  }

  async showLightbulb() {

    this.idea = true;

    const bulb = this.lightbulb;

    this._updateLightbulbPosition();

    const position = bulb.position;

    const movement = animation(
      'movement', 'position',
      [
        [0, this.sprite.position],
        [5, position]
      ],
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3
    );

    const size = bulb.size;
    const scale = animation(
      'scale', 'size',
      [
        [0, 0],
        [2, 0],
        [3, 1.5 * size],
        [5, size]
      ]
    );

    bulb.animations = [movement, scale];

    movement.setEasingFunction(elastic);

    bulb.isVisible = true;

    await play(bulb, 5);

    bulb.size = size;

  }

  async hideLightbulb() {

    this.idea = false;

    const bulb = this.lightbulb;
    const size = bulb.size;

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
