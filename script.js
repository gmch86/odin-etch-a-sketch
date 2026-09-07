const canvasData = {
  gridSize: 16,
  defaultColor: "rgb(255, 255, 255)",
  paintMode: "fill",
  isPainting: false,
};

// Initialize 16x16 grid
const gridContainer = createGrid(canvasData.gridSize);
gridContainer.addEventListener("mouseover", (e) => {
  if (canvasData.isPainting) paint(e.target);
});

gridContainer.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Prevent dragging

  canvasData.isPainting = true;
  paint(e.target);
});

document.addEventListener("mouseup", (e) => {
  canvasData.isPainting = false;
});

// Grid size input
const gridSizeInput = document.querySelector("#grid-size");
gridSizeInput.value = canvasData.size;

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

// Build grid button
const buildGridBtn = document.querySelector(".build-grid-btn");
buildGridBtn.addEventListener("click", (e) => {
  const size = gridSizeInput.value || canvasData.size;
  createGrid(size);
});

// Button for removing the colors on all grid tiles
const clearGridBtn = document.querySelector(".clear-grid-btn");
clearGridBtn.addEventListener("click", clearTiles);

// Button for fill paint mode
const fillBtn = document.querySelector(".fill-btn");
fillBtn.addEventListener("click", (e) => (canvasData.paintMode = "fill"));

// Button for blend paint mode
const blendBtn = document.querySelector(".blend-btn");
blendBtn.addEventListener("click", (e) => (canvasData.paintMode = "blend"));

// Button for darken paint mode
const darkenBtn = document.querySelector(".darken-btn");
darkenBtn.addEventListener("click", (e) => (canvasData.paintMode = "darken"));

// Button for lighten paint mode
const lightenBtn = document.querySelector(".lighten-btn");
lightenBtn.addEventListener("click", (e) => (canvasData.paintMode = "lighten"));

// #############################################################################

function createGrid(size) {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    for (let col = 0; col < size; col++) {
      const tileElement = document.createElement("div");
      tileElement.classList.add("tile");
      tileElement.style.backgroundColor = canvasData.defaultColor;
      rowElement.append(tileElement);
    }

    gridContainer.append(rowElement);
  }

  return gridContainer;
}

function getRGBValues(color) {
  const values = {};

  if (color[0] === "#") {
    // Hex
    values.r = parseInt(color.slice(1, 3), 16);
    values.g = parseInt(color.slice(3, 5), 16);
    values.b = parseInt(color.slice(5, 7), 16);
  } else {
    // RGB
    [values.r, values.g, values.b] = color.replace(/rgb|\(|\)/g, "").split(",");
  }

  return { r: +values.r, g: +values.g, b: +values.b };
}

function paint(tile) {
  if (!tile.classList.contains("tile"));

  const selectedColor = document.querySelector("#color-select").value;
  const tileColor = tile.style.backgroundColor;

  const selectedRGBValues = getRGBValues(selectedColor);
  const tileRGBValues = getRGBValues(tileColor);

  switch (canvasData.paintMode) {
    case "fill":
      fillTile(tile, selectedRGBValues);
      break;
    case "blend":
      blendTile(tile, tileRGBValues, selectedRGBValues);
      break;
    case "darken":
      changeTileBrightness(tile, tileRGBValues, "darken");
      break;
    case "lighten":
      changeTileBrightness(tile, tileRGBValues, "lighten");
      break;
  }
}

function clearTiles() {
  const tiles = document.querySelectorAll(".tile");
  [...tiles].forEach((tile) => {
    tile.style.backgroundColor = canvasData.defaultColor;
  });
}

function fillTile(tile, rgbValues) {
  const { r, g, b } = rgbValues;
  tile.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Gradually converts tile color to selectedRGBValues
function blendTile(tile, tileRGBValues, selectedRGBValues) {
  const getIncrementedValue = (fromValue, toValue) => {
    // Get an increment value of at least 5
    const increment = Math.max(
      5,
      Math.ceil(Math.abs((toValue - fromValue) / 10)),
    );

    if (fromValue > toValue) {
      // Decrement fromValue to reach toValue
      return Math.max(toValue, fromValue - increment);
    } else if (fromValue < toValue) {
      // Increment fromValue to reach toValue
      return Math.min(toValue, fromValue + increment);
    } else {
      // Values are equal
      return toValue;
    }
  };

  if (
    tileRGBValues.r !== selectedRGBValues.r ||
    tileRGBValues.g !== selectedRGBValues.g ||
    tileRGBValues.b !== selectedRGBValues.b
  ) {
    const incrementedR = getIncrementedValue(
      tileRGBValues.r,
      selectedRGBValues.r,
    );
    const incrementedG = getIncrementedValue(
      tileRGBValues.g,
      selectedRGBValues.g,
    );
    const incrementedB = getIncrementedValue(
      tileRGBValues.b,
      selectedRGBValues.b,
    );

    tile.style.backgroundColor = `rgb(${incrementedR}, ${incrementedG}, ${incrementedB})`;
  }
}

function changeTileBrightness(tile, tileRGBValues, type) {
  const increment = type === "darken" ? -10 : type === "lighten" ? 10 : 0;

  tileRGBValues.r = Math.min(255, Math.max(0, tileRGBValues.r + increment));
  tileRGBValues.g = Math.min(255, Math.max(0, tileRGBValues.g + increment));
  tileRGBValues.b = Math.min(255, Math.max(0, tileRGBValues.b + increment));

  tile.style.backgroundColor = `rgb(${tileRGBValues.r}, ${tileRGBValues.g}, ${tileRGBValues.b})`;
}
