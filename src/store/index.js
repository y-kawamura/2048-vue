import Vue from 'vue';
import Vuex from 'vuex';

import { INSERT_CELL } from './mutation-types'
import Tile from './tile';

Vue.use(Vuex);

function createCells() {
  return [...Array(4)].map(() => Array(4).fill(null));
}

function randomCells(cells) {
  if (!cells) {
    return null;
  }
  return cells[Math.floor(Math.random() * cells.length)];
}

export default new Vuex.Store({
  state: {
    cells: createCells(),
  },
  getters: {
    availableCells(state) {
      let cells = [];
      state.cells.forEach((rows, y) => {
        rows.forEach((cell, x) => {
          if (!cell) {
            cells.push({ x, y });
          }
        });
      });
      return cells;
    },
  },
  mutations: {
    [INSERT_CELL](state, tile) {
      state.cells[tile.y].splice(tile.x, 1, tile);
    },
  },
  actions: {
    addNewTile({commit, getters}) {
      const cell = randomCells(getters.availableCells);
      const value = Math.random() > 0.1 ? 2 : 4;
      const tile = new Tile(cell.x, cell.y, value);
      commit(INSERT_CELL, tile);
    },
  },
  modules: {},
});
