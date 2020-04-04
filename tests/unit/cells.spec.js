import { expect } from 'chai';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import store from '@/store';
import Tile from '@/store/tile';

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
      { x: 3, y: 3 }
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
      .filter(cell => cell !== null);

    expect(cells[0]).to.be.an.instanceOf(Tile);
    expect(cells[1]).to.be.an.instanceOf(Tile);
  });
});