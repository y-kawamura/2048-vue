import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function createCells() {
  return [...Array(4)].map(() => Array(4).fill(null));

}

export default new Vuex.Store({
  state: {
    cells: createCells(),
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
