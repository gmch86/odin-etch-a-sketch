// Initialize 16x16 grid
const gridContainer = createGrid(16);

// Grid container listeners
gridContainer.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("tile")) {
    handleTileMouseOver(e);
  }
});

// Build grid button
const buildGridBtn = document.querySelector(".build-grid-btn");

buildGridBtn.addEventListener("click", (e) => {
  const size = gridSizeInput.value;
  createGrid(size);
});

// Grid size input
const gridSizeInput = document.querySelector("#grid-size");

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

// Color selector input
const colorInput = document.querySelector("#color-select");
let selectedColor = colorInput.value;

colorInput.addEventListener("change", (e) => {
  selectedColor = e.target.value;
});

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
  tiles.forEach((tile) => {
    tile.style.backgroundColor = "";
  });
}

function handleTileMouseOver(e) {
  const fillOnHoverCheckbox = document.querySelector("#fill-on-hover");

  if (fillOnHoverCheckbox.checked)
    e.target.style.backgroundColor = selectedColor;
}
