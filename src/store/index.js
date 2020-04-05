import Vue from 'vue';
import Vuex from 'vuex';

import { INSERT_CELL, MOVE_CELL, REMOVE_CELL } from './mutation-types';
import Tile from './tile';
import helper from './helper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cells: helper.createCells(),
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
    getTile(state) {
      return (cell) => {
        return helper.withinGrid(cell) ? state.cells[cell.y][cell.x] : null;
      };
    },
    findForemostPosition(_, getters) {
      return (cell, vector) => {
        let nextCell = cell;
        do {
          cell = nextCell;
          nextCell = {
            x: cell.x + vector.x,
            y: cell.y + vector.y,
          };
        } while (helper.withinGrid(nextCell) && !getters.getTile(nextCell));
        return cell;
      };
    },
  },
  mutations: {
    [INSERT_CELL](state, tile) {
      // Note: should use splice for reactive
      state.cells[tile.y].splice(tile.x, 1, tile);
    },
    [MOVE_CELL](state, tile) {
      state.cells[tile.previous.y].splice(tile.previous.x, 1, null);
      state.cells[tile.y].splice(tile.x, 1, tile);
    },
    [REMOVE_CELL](state, tile) {
      state.cells[tile.y].splice(tile.x, 1, null);
    },
  },
  actions: {
    addNewTile({ commit, getters }) {
      const cell = helper.randomCells(getters.availableCells);
      const value = Math.random() > 0.1 ? 2 : 4;
      const tile = new Tile(cell.x, cell.y, value);
      commit(INSERT_CELL, tile);
    },
    move({ commit, getters }, direction) {
      const vector = helper.getVector(direction);
      const scanningCells = helper.createScanningCells(vector);

      scanningCells.forEach((cell) => {
        const tile = getters.getTile(cell);
        if (tile) {
          // clear merged flag
          tile.clearMerged();

          // 1. find a possible foremost position
          const foremostCell = getters.findForemostPosition(cell, vector);

          // 2. Check if can merge
          const nextCell = {
            x: foremostCell.x + vector.x,
            y: foremostCell.y + vector.y,
          };
          const currTile = getters.getTile(cell);
          const nextTile = getters.getTile(nextCell);

          if (nextTile && nextTile.canMerge(currTile)) {
            // 3. merge to a next tile
            nextTile.merge();
            // 4. remove own tile
            commit(REMOVE_CELL, cell);
          } else {
            // 3. move tile
            tile.update(foremostCell.x, foremostCell.y);
            commit(MOVE_CELL, tile);
          }
        }
      });
    },
  },
  modules: {},
});
