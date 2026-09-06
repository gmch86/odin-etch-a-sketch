function createGrid(size = 16) {
  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement("div");

    rowElement.classList.add("row");
    rowElement.dataset.row = row + 1;

    for (let col = 0; col < size; col++) {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.dataset.row = row + 1;
      tileElement.dataset.col = col + 1;

      rowElement.append(tileElement);
    }

    document.querySelector(".canvas-container").append(rowElement);
  }
}

createGrid();
