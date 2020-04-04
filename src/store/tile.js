class Tile {
  constructor(x, y, value = 2) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.previousPosition = null;
    this.merged = false;
  }

  update(x, y) {
    this.previousPosition = {x: this.x, y: this.y};
    this.x = x;
    this.y = y;
  }

  merge() {
    this.merged = true;
    this.value *= 2;
  }
}

export default Tile;
