import { Cell, Universe } from "game-of-life";
import { memory } from "game-of-life/game_of_life_bg.wasm";
import { getElement } from "./dom";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells
// and a 1px border around each of them.
const canvas = getElement("#game-of-life-canvas", HTMLCanvasElement);
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;

const context = canvas.getContext("2d")!;

function render() {
  universe.tick();

  draw_grid();
  draw_cells();

  window.requestAnimationFrame(render);
}

draw_grid();
draw_cells();
window.requestAnimationFrame(render);

function draw_grid() {
  context.beginPath();
  context.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let idx = 0; idx <= width; idx++) {
    context.moveTo(idx * (CELL_SIZE + 1) + 1, 0);
    context.lineTo(idx * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let idx = 0; idx <= height; idx++) {
    context.moveTo(0, idx * (CELL_SIZE + 1) + 1);
    context.lineTo((CELL_SIZE + 1) * width + 1, idx * (CELL_SIZE + 1) + 1);
  }

  context.stroke();
}

function getIndex(row: number, column: number) {
  return row * width + column;
}

function draw_cells() {
  const cells_pointer = universe.cells();
  const cells = new Uint8Array(memory.buffer, cells_pointer, width * height);

  context.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      context.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      context.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  context.stroke();
}
