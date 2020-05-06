const form = document.querySelector("form");
const select = document.querySelector("select");
const tbody = document.querySelector("tbody");
const empty = tbody.children[0];

export function addFormSubmitListener(listener) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    listener(select.value);
  });
}

function createRoomRadioCell(character, room, lightbulb) {

  const cell = document.createElement("td");
  const input = document.createElement("input");

  cell.appendChild(input);
  cell.className = "cell";

  if (room) {

    cell.style.backgroundColor = room.color;

  }

  input.type = "radio";
  input.name = character.id;
  input.checked = room === character.room;

  const selector = `[name=${character.id}].marked`;

  input.onchange = async () => {

    const marked = document.querySelector(selector);

    lightbulb.disabled = room == null;

    if (input.checked) {

      const previous = character.room;

      await character.goToRoom(room);

      if (character.room != room) {
        character.room = previous;
        if (marked)
          marked.checked = true;
      } else {
        input.classList.add('marked');
        if (marked)
          marked.classList.remove('marked');
      }

    }
  };

  cell.onclick = () => {
    input.click();
  };

  return cell;

}

function createLightbulbCheckboxUI(character) {

  const cell = document.createElement("td");
  const input = document.createElement("input");

  cell.appendChild(input);
  cell.className = "cell";

  input.type = "checkbox";
  input.checked = false;
  input.disabled = character.room == null;

  input.onchange = () => {
    character[input.checked ? "showLightbulb" : "hideLightbulb"]();
  };

  cell.onclick = event => {
    if (event.target === cell) {
      input.click();
    }
  };

  return [cell, input];

}

export function createCharacterUI(character, rooms) {

  empty.hidden = true;

  const row = document.createElement("tr");
  const name = document.createElement("td");

  name.textContent = character.name;

  const [last, lightbulb] = createLightbulbCheckboxUI(character);

  const cells = rooms.map((room) => createRoomRadioCell(character, room, lightbulb));
  const nowhere = createRoomRadioCell(character, null, lightbulb);

  row.append(name, ...cells, nowhere, last);

  tbody.appendChild(row);

}

export function createCharacterKindUI(kind, index) {
  const option = document.createElement("option");
  option.text = kind;
  option.value = index;
  select.add(option);
  return option;
}