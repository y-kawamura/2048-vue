import { expect } from 'chai';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import store from '@/store';
import Tile from '@/store/tile';
import helper from '@/store/helper';
import { GRID_SIZE } from '../../src/config';

describe('Setup cells', () => {
  it('creates cells with null', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        expect(store.state.cells[y][x]).to.equal(null);
      }
    }
  });
});

describe('Getter availableCells', () => {
  it('returns available cells postions', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    expect(store.getters.availableCells).to.deep.equal([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ]);
  });
});


describe('Action addNewTile', () => {
  it('should add tile to random available cell', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store.dispatch('addNewTile');
    store.dispatch('addNewTile');
    const cells = store.state.cells
      .reduce((acc, cur) => {
        acc.push(...cur);
        return acc;
      }, [])
      .filter((cell) => cell !== null);

    expect(cells[0]).to.be.an.instanceOf(Tile);
    expect(cells[1]).to.be.an.instanceOf(Tile);
  });
});

describe('Action move', () => {
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        store.state.cells[y][x] = null;
      }
    }
  });

  it('should move tile to direction up', () => {
    const tile1 = new Tile(1, 1, 2);
    const tile2 = new Tile(2, 2, 4);
    store.state.cells[tile1.y][tile1.x] = tile1;
    store.state.cells[tile2.y][tile2.x] = tile2;

    store.dispatch('move', 'up');

    expect(store.state.cells[0][1]).to.deep.equal({
      x: 1,
      y: 0,
      value: 2,
      previous: { x: 1, y: 1 },
      merged: false,
    });
    expect(store.state.cells[0][2]).to.deep.equal({
      x: 2,
      y: 0,
      value: 4,
      previous: { x: 2, y: 2 },
      merged: false,
    });
  });

  it('should move tile to direction down', () => {
    const tile1 = new Tile(1, 1, 2);
    const tile2 = new Tile(2, 2, 4);
    store.state.cells[tile1.y][tile1.x] = tile1;
    store.state.cells[tile2.y][tile2.x] = tile2;

    store.dispatch('move', 'down');

    expect(store.state.cells[3][1]).to.deep.equal({
      x: 1,
      y: 3,
      value: 2,
      previous: { x: 1, y: 1 },
      merged: false,
    });
    expect(store.state.cells[3][2]).to.deep.equal({
      x: 2,
      y: 3,
      value: 4,
      previous: { x: 2, y: 2 },
      merged: false,
    });
  });

  it('should move tile to direction left', () => {
    const tile1 = new Tile(1, 1, 2);
    const tile2 = new Tile(2, 2, 4);
    store.state.cells[tile1.y][tile1.x] = tile1;
    store.state.cells[tile2.y][tile2.x] = tile2;

    store.dispatch('move', 'left');

    expect(store.state.cells[1][0]).to.deep.equal({
      x: 0,
      y: 1,
      value: 2,
      previous: { x: 1, y: 1 },
      merged: false,
    });
    expect(store.state.cells[2][0]).to.deep.equal({
      x: 0,
      y: 2,
      value: 4,
      previous: { x: 2, y: 2 },
      merged: false,
    });
  });

  it('should move tile to direction right', () => {
    const tile1 = new Tile(1, 1, 2);
    const tile2 = new Tile(2, 2, 4);
    store.state.cells[tile1.y][tile1.x] = tile1;
    store.state.cells[tile2.y][tile2.x] = tile2;

    store.dispatch('move', 'right');

    expect(store.state.cells[1][3]).to.deep.equal({
      x: 3,
      y: 1,
      value: 2,
      previous: { x: 1, y: 1 },
      merged: false,
    });
    expect(store.state.cells[2][3]).to.deep.equal({
      x: 3,
      y: 2,
      value: 4,
      previous: { x: 2, y: 2 },
      merged: false,
    });
  });

  it('should move and merge tile if next is same value', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(1, 1, 2);
    const tile3 = new Tile(2, 1, 2);
    store.state.cells[tile1.y][tile1.x] = tile1;
    store.state.cells[tile2.y][tile2.x] = tile2;
    store.state.cells[tile3.y][tile3.x] = tile3;

    store.dispatch('move', 'left');
    expect(store.state.cells[1][0]).to.deep.equal({
      x: 0,
      y: 1,
      value: 4,
      previous: null,
      merged: true,
    });
    expect(store.state.cells[1][1]).to.deep.equal({
      x: 1,
      y: 1,
      value: 2,
      previous: { x: 2, y: 1 },
      merged: false,
    });

  })

});

describe('Helper createScanningCells', () => {
  it('should be create correct scanning cells when direction is up', () => {
    const dir = 'up';
    const vector = helper.getVector(dir);
    const scanningCells = helper.createScanningCells(vector);
    expect(scanningCells).to.deep.equal([
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ]);
  });
  it('should be create correct scanning cells when direction is down', () => {
    const dir = 'down';
    const vector = helper.getVector(dir);
    const scanningCells = helper.createScanningCells(vector);
    expect(scanningCells).to.deep.equal([
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 0 },
    ]);
  });
  it('should be create correct scanning cells when direction is left', () => {
    const dir = 'left';
    const vector = helper.getVector(dir);
    const scanningCells = helper.createScanningCells(vector);
    expect(scanningCells).to.deep.equal([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ]);
  });
  it('should be create correct scanning cells when direction is right', () => {
    const dir = 'right';
    const vector = helper.getVector(dir);
    const scanningCells = helper.createScanningCells(vector);
    expect(scanningCells).to.deep.equal([
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ]);
  });
});
