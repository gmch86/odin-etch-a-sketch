DEFAULT_SIZE = 16;

// Initialize 16x16 grid
const gridContainer = createGrid(DEFAULT_SIZE);
let isPainting = false;

gridContainer.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("tile") && isPainting) {
    fillTile(e.target);
  }
});

gridContainer.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Prevent dragging

  isPainting = true;
});

document.addEventListener("mouseup", (e) => {
  isPainting = false;
});

// Build grid button
const buildGridBtn = document.querySelector(".build-grid-btn");

buildGridBtn.addEventListener("click", (e) => {
  const size = gridSizeInput.value;
  createGrid(size);
});

// Grid size input
const gridSizeInput = document.querySelector("#grid-size");
gridSizeInput.value = DEFAULT_SIZE;

gridSizeInput.addEventListener("input", (e) => {
  // Remove non-integers from the input
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

gridSizeInput.addEventListener("change", (e) => {
  // Limit input size values
  if (e.target.value > 100) {
    e.target.value = 100;
  } else if (e.target.value < 16) {
    e.target.value = 16;
  }
});

// Button for removing the colors on all grid tiles
const clearGridBtn = document.querySelector(".clear-grid-btn");

clearGridBtn.addEventListener("click", clearTiles);

// #################################################################

function createGrid(size) {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement("div");

    rowElement.classList.add("row");

    for (let col = 0; col < size; col++) {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      rowElement.append(tileElement);
    }

    gridContainer.append(rowElement);
  }

  return gridContainer;
}

function clearTiles() {
  const tiles = document.querySelectorAll(".tile");

  [...tiles].forEach((tile) => {
    tile.style.backgroundColor = "";
  });
}

function fillTile(tile) {
  const colorInput = document.querySelector("#color-select");

  tile.style.backgroundColor = colorInput.value;
}
