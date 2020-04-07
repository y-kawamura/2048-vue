import Vue from 'vue';
import Vuex from 'vuex';

import {
  INSERT_CELL,
  MOVE_CELL,
  REMOVE_CELL,
  SET_MOVED,
  INC_MOVE_COUNT,
  ADD_SCORE,
  RESET_BOARD,
} from './mutation-types';
import Tile from './tile';
import helper from './helper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cells: helper.createCells(),
    moved: false,
    moveCount: 0,
    score: 0,
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
    [SET_MOVED](state, isMoved) {
      state.moved = isMoved;
    },
    [INC_MOVE_COUNT](state) {
      state.moveCount++;
    },
    [ADD_SCORE](state, value) {
      state.score += value;
    },
    [RESET_BOARD](state) {
      state.cells = helper.createCells();
      state.moveCount = 0;
      state.score = 0;
    }
  },
  actions: {
    resetBoard({commit}) {
      commit(RESET_BOARD);
    },
    addNewTile({ commit, getters }) {
      const cell = helper.randomCells(getters.availableCells);
      const value = Math.random() > 0.1 ? 2 : 4;
      const tile = new Tile(cell.x, cell.y, value);
      commit(INSERT_CELL, tile);
    },
    move({ commit, getters }, direction) {
      const vector = helper.getVector(direction);
      const scanningCells = helper.createScanningCells(vector);
      let isMoved = false;

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
            nextTile.merge(currTile);
            // 4. remove own tile
            commit(REMOVE_CELL, cell);
            isMoved = true;
            // 5. Add score
            commit(ADD_SCORE, nextTile.value);
          } else {
            // 3. move tile
            // Note: Update previous value even if it did not move
            tile.update(foremostCell.x, foremostCell.y);
            commit(MOVE_CELL, tile);

            if (cell.x !== foremostCell.x || cell.y !== foremostCell.y) {
              isMoved = true;
            }
          }
        }
      });

      if (isMoved) {
        commit(SET_MOVED, true);
        commit(INC_MOVE_COUNT);
      } else {
        commit(SET_MOVED, false);
      }
    },
  },
  modules: {},
});
