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
      tileElement.style.backgroundColor = canvasData.defaultColor;
      rowElement.append(tileElement);
    }

    gridContainer.append(rowElement);
  }

  return gridContainer;
}

function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function paint(target) {
  const color = hexToRGB(document.querySelector("#color-select").value);
  const isValidTarget = target.classList.contains("tile");

  if (isValidTarget) {
    switch (canvasData.paintMode) {
      case "fill":
        fillTile(target, `rgb(${color.r}, ${color.g}, ${color.b})`);
        break;
      case "blend":
        blendTile(target, `rgb(${color.r}, ${color.g}, ${color.b})`);
        break;
    }
  }
}

function clearTiles() {
  const tiles = document.querySelectorAll(".tile");
  [...tiles].forEach((tile) => {
    tile.style.backgroundColor = DEFAULT_COLOR;
  });
}

function fillTile(tile, color) {
  tile.style.backgroundColor = color;
}

function blendTile(tile, color) {
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

  const tileColor = tile.style.backgroundColor;
  const tileRgbValues = tileColor.replace(/rgb|\(|\)/g, "").split(",");
  const colorRgbValues = color.replace(/rgb|\(|\)/g, "").split(",");

  if (
    tileRgbValues[0] !== colorRgbValues[0] ||
    tileRgbValues[1] !== colorRgbValues[1] ||
    tileRgbValues[2] !== colorRgbValues[2]
  ) {
    const incrementedR = getIncrementedValue(
      +tileRgbValues[0],
      +colorRgbValues[0],
    );
    const incrementedG = getIncrementedValue(
      +tileRgbValues[1],
      +colorRgbValues[1],
    );
    const incrementedB = getIncrementedValue(
      +tileRgbValues[2],
      +colorRgbValues[2],
    );

    tile.style.backgroundColor = `rgb(${incrementedR}, ${incrementedG}, ${incrementedB})`;
  }
}
