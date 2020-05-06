import Room from "./Room.js";
import CharacterKind from "./CharacterKind.js";

import {
  createCharacterKindUI,
  addFormSubmitListener,
  createCharacterUI
} from "./ui.js";

import { pickOrNull } from "./utils.js";

const rooms = [
  new Room("Garage", +5, +5, -5),
  new Room("Living", -5, +5, +5),
  new Room("Bedroom", +5, -5, +5),
];

const kinds = [
  new CharacterKind("Boy", "#0088FF"),
  new CharacterKind("Girl", "#FF0088"),
];

kinds.forEach((kind, index) => {
  createCharacterKindUI(kind.name, index);
});

addFormSubmitListener((index) => {
  const kind = kinds[index];
  const character = kind.instanciate();
  if (character) {
    character.goToRoom(pickOrNull(rooms));
    createCharacterUI(character, rooms);
  }
});
