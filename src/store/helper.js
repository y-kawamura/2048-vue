import { GRID_SIZE } from '@/config';

function createCells() {
  return [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE).fill(null));
}

function randomCells(cells) {
  if (!cells) {
    return null;
  }
  return cells[Math.floor(Math.random() * cells.length)];
}

function withinGrid(cell) {
  return cell.x >= 0 && cell.x < GRID_SIZE && cell.y >= 0 && cell.y < GRID_SIZE;
}

function getVector(direction) {
  const vectorMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  return vectorMap[direction];
}

function createScanningCells(vector) {
  let row = [];
  let col = [];
  for (let index = 0; index < GRID_SIZE; index++) {
    row.push(index);
    col.push(index);
  }

  if (vector.x === 1 || vector.y === 1) {
    col = col.reverse();
  }

  let cells = [];
  if (vector.y !== 0) {
    // if vertical direction, row is x
    row.forEach((x) => {
      col.forEach((y) => {
        cells.push({ x, y });
      });
    });
  } else {
    // if horizontal direction, row is y
    row.forEach((y) => {
      col.forEach((x) => {
        cells.push({ x, y });
      });
    });
  }
  return cells;
}

function nextCell(cell, vector) {
  return {
    x: cell.x + vector.x,
    y: cell.y + vector.y,
  }
}

export default {
  createCells,
  randomCells,
  withinGrid,
  getVector,
  createScanningCells,
  nextCell,
};
