function createGrid(size = 16) {
  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement("div");

    rowElement.classList.add("row");
    rowElement.dataset.row = row;

    for (let col = 0; col < size; col++) {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.dataset.row = row;
      tileElement.dataset.col = col;

      rowElement.append(tileElement);
    }

    document.querySelector(".canvas-container").append(rowElement);
  }
}

function fillTile(row, col, color = "") {
  const tile = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  tile.style.backgroundColor = color;
}

createGrid();
