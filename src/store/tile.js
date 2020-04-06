class Tile {
  constructor(x, y, value = 2) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.previous = null;
    this.merged = false;
  }

  update(x, y) {
    this.previous = { x: this.x, y: this.y };
    this.x = x;
    this.y = y;
  }

  merge(tile) {
    this.merged = true;
    this.value *= 2;
    this.previous = { x: tile.x, y: tile.y }
  }

  clearMerged() {
    this.merged = false;
  }

  canMerge(tile) {
    return tile && this.value === tile.value && !this.merged;
  }
}

export default Tile;
