<template>
  <div class="container">
    <div>
      <h1 class="title">2048</h1>
      <div class="board">
        <div class="row" v-for="(rows, rowIndex) in cells" :key="rowIndex">
          <Tile
            v-for="(cell, colIndex) in rows"
            :key="rowIndex * 4 + colIndex"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tile from './Tile';

export default {
  components: {
    Tile,
  },
  computed: {
    ...mapState(['cells']),
    cellsRow() {
      return this.cells;
    },
  },
};
</script>

<style lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background-color: #5e6b7a;
  color: #ecf0f1;
  overflow: hidden;

  display: flex;
  justify-content: center;
}

.title {
  margin: 3rem 0 2rem 0;
  font-size: 3rem;
}

.board {
  background-color: #34495e;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.row {
  display: flex;
}
</style>
