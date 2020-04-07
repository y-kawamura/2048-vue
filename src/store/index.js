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
import { GRID_SIZE } from '@/config';

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
    canMove(_, getters) {
      if (getters.availableCells.length > 0) {
        return true;
      }

      // check all cells
      let cells = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          cells.push({ x, y });
        }
      }

      // check if the tile can merge to next tile for down and right direction
      for (let index = 0; index < cells.length; index++) {
        const cell = cells[index];
        const tile = getters.getTile(cell);

        if (tile) {
          const nextTileMatch = ['down', 'right'].some((dir) => {
            const vector = helper.getVector(dir);
            const nextTile = getters.getTile(helper.nextCell(cell, vector));
            if (nextTile && tile.value == nextTile.value) {
              return true;
            }
            return false;
          });

          if (nextTileMatch) {
            return true;
          }
        }
      }
      return false;
    },
    has2048(_, getters) {
      let cells = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          cells.push({ x, y });
        }
      }

      for (let index = 0; index < cells.length; index++) {
        const tile = getters.getTile(cells[index]);
        if (tile && tile.value === 2048) {
          return true;
        }
      }
      return false;
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
      if (tile.previous.x !== tile.x || tile.previous.y !== tile.y) {
        state.moved = true;
      }
    },
    [REMOVE_CELL](state, tile) {
      state.cells[tile.y].splice(tile.x, 1, null);
      state.moved = true;
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
    },
  },
  actions: {
    resetBoard({ commit }) {
      commit(RESET_BOARD);
    },
    addNewTile({ commit, getters }) {
      const cell = helper.randomCells(getters.availableCells);
      const value = Math.random() > 0.1 ? 2 : 4;
      const tile = new Tile(cell.x, cell.y, value);
      commit(INSERT_CELL, tile);
    },
    move({ state, commit, getters }, direction) {
      const vector = helper.getVector(direction);
      const scanningCells = helper.createScanningCells(vector);

      // Clear moved flag
      commit(SET_MOVED, false);

      scanningCells.forEach((cell) => {
        const tile = getters.getTile(cell);
        if (tile) {
          // clear merged flag
          tile.clearMerged();

          // 1. find a possible foremost position
          const foremostCell = getters.findForemostPosition(cell, vector);

          // 2. Check if can merge
          const currTile = getters.getTile(cell);
          const nextTile = getters.getTile(
            helper.nextCell(foremostCell, vector)
          );

          if (nextTile && nextTile.canMerge(currTile)) {
            // 3-a. merge to a next tile
            nextTile.merge(currTile);
            // 4. remove own tile
            commit(REMOVE_CELL, cell);
            // 5. Add score
            commit(ADD_SCORE, nextTile.value);
          } else {
            // 3-b. move tile
            // Note: We need to update previous value even if it did not move
            tile.update(foremostCell.x, foremostCell.y);
            commit(MOVE_CELL, tile);
          }
        }
      });

      if (state.moved) {
        commit(INC_MOVE_COUNT);
      }
    },
  },
  modules: {},
});
