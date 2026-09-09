const canvasData = {
  gridSize: 16,
  defaultColor: "rgb(255, 255, 255)",
  selectedColor: null,
  paintMode: "fill",
  isPainting: false,
  undoHistory: [],
  redoHistory: [],
};

// Initialize 16x16 grid
const gridContainer = createGrid(canvasData.gridSize);
gridContainer.addEventListener("mouseover", (e) => {
  if (canvasData.isPainting) {
    handleHistory(e.target);
    paint(e.target);
  }
});

gridContainer.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Prevent dragging

  canvasData.isPainting = true;

  handleHistory(e.target, true); // newStroke = true
  paint(e.target);
});

document.addEventListener("mouseup", (e) => {
  if (canvasData.isPainting) {
    canvasData.isPainting = false;
  }

  // Update `toColor` of each tile in history when stroke is finished
  if (canvasData.undoHistory.at(-1)) {
    for (const tile of canvasData.undoHistory.at(-1).keys()) {
      handleHistory(tile);
    }
  }
});

// Grid size input
const gridSizeInput = document.querySelector("#grid-size");
gridSizeInput.value = canvasData.gridSize;

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

// Color selector
const colorInput = document.querySelector("#color-select");

colorInput.addEventListener("change", (e) => {
  // Convert input value to rgb and assign to selected colour
  const { r, g, b } = getRGBValues(e.target.value);
  canvasData.selectedColor = `rgb(${r}, ${g}, ${b})`;
});

colorInput.dispatchEvent(new Event("change")); // Set the selected colour in rgb format

// Build grid button
const buildGridBtn = document.querySelector(".build-grid-btn");
buildGridBtn.addEventListener("click", (e) => {
  const size = gridSizeInput.value || canvasData.size;
  createGrid(size);

  canvasData.undoHistory.length = 0;
  canvasData.redoHistory.length = 0;
});

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

// Erase for erase paint mode
const eraserBtn = document.querySelector(".eraser-btn");
eraserBtn.addEventListener("click", (e) => (canvasData.paintMode = "erase"));

// Undo button
const undoBtn = document.querySelector(".undo-btn");
undoBtn.addEventListener("click", () => undoRedo("undo"));

// Redo button
const redoBtn = document.querySelector(".redo-btn");
redoBtn.addEventListener("click", () => undoRedo("redo"));

// #############################################################################

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

function paint(tile) {
  if (!tile.classList.contains("tile")) return;

  // Get the color / RGB values of tile and selected color
  const tileColor = tile.style.backgroundColor;
  const selectedColor = canvasData.selectedColor;
  const tileRGBValues = getRGBValues(tileColor);
  const selectedRGBValues = getRGBValues(selectedColor);

  // Gradually transforms the RGB values of a tile
  const blendTile = (tileRGBValues, selectedRGBValues) => {
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
  };

  switch (canvasData.paintMode) {
    case "fill":
      tile.style.backgroundColor = `rgb(${selectedRGBValues.r}, ${selectedRGBValues.g}, ${selectedRGBValues.b})`;
      break;
    case "blend":
      blendTile(tileRGBValues, selectedRGBValues);
      break;
    case "darken":
      blendTile(tileRGBValues, { r: 0, g: 0, b: 0 });
      break;
    case "lighten":
      blendTile(tileRGBValues, { r: 255, g: 255, b: 255 });
      break;
    case "erase":
      tile.style.backgroundColor = canvasData.defaultColor;
      break;
  }
}

function handleHistory(tile, newStroke = false) {
  // Limit for number of strokes saved in history
  const undoLimit = 10;

  // Shift stroke arrays if undo limit reached
  if (canvasData.undoHistory.length > undoLimit) {
    canvasData.undoHistory.shift();
  }

  let historyObj;

  if (!newStroke) {
    // Check if tile already exists in current stroke
    historyObj = canvasData.undoHistory.at(-1).get(tile);
  } else {
    // Create a map to begin a new stroke
    canvasData.undoHistory.push(new Map());

    // Clear redo history
    canvasData.redoHistory.length = 0;
  }

  if (historyObj) {
    // If the tile has already been painted in current stroke, update `toColor` to its current background color.
    // This mainly handles cases where painting a tile doesn’t immediately apply the selected color, such as the `blend` paint mode
    historyObj.toColor = tile.style.backgroundColor;
  } else {
    // Push a new object to stroke array
    canvasData.undoHistory.at(-1).set(tile, {
      fromColor: tile.style.backgroundColor,
      toColor: null,
    });
  }
}

function undoRedo(action) {
  if (action !== "undo" && action !== "redo") return;

  const isUndo = action === "undo";

  const stroke = isUndo
    ? canvasData.undoHistory.pop()
    : canvasData.redoHistory.pop();

  if (stroke) {
    isUndo
      ? canvasData.redoHistory.push(stroke)
      : canvasData.undoHistory.push(stroke);

    for (const [tile, obj] of stroke.entries()) {
      tile.style.backgroundColor = isUndo ? obj.fromColor : obj.toColor;
    }
  }
}
