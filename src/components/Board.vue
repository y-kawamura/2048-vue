<template>
  <div class="container">
    <div>
      <div class="heaader">
        <h1 class="title">2048</h1>
        <div class="flex">
          <div class="score">
            <span class="score-title">score</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <button @click="newGame" class="newgame-button">New Game</button>
        </div>
      </div>
      <div class="board">
        <div class="row" v-for="(rows, y) in cells" :key="y">
          <Tile v-for="(cell, x) in rows" :key="cellIndex(x, y)" :tile="cell" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Tile from './Tile';
import { GRID_SIZE } from '@/config';

export default {
  components: {
    Tile,
  },
  computed: {
    ...mapState(['cells', 'moved', 'score']),
    cellIndex() {
      return (x, y) => y * GRID_SIZE + x;
    },
  },
  methods: {
    ...mapActions(['addNewTile', 'move', 'resetBoard']),
    setup() {
      this.addNewTile();
      this.addNewTile();
    },
    newGame() {
      this.resetBoard();
      this.setup();
    }
  },
  mounted() {
    this.setup();

    // Add key event
    window.addEventListener('keydown', (e) => {
      console.log(e.key);
      if (e.key == 'ArrowUp') {
        this.move('up');
      }
      if (e.key == 'ArrowDown') {
        this.move('down');
      }
      if (e.key == 'ArrowLeft') {
        this.move('left');
      }
      if (e.key == 'ArrowRight') {
        this.move('right');
      }

      if (this.moved) {
        this.addNewTile();
      }
    });
  },
};
</script>

<style lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background-color: #5e6b7a;
  color: #b4c6cc;
  overflow: hidden;

  display: flex;
  justify-content: center;
}

.heaader {
  margin: 3rem 0 1rem 0;

  .title {
    font-size: 2rem;
    margin: 0;
    padding: 0;
  }

  .flex {
    display: flex;
    justify-content: space-between;

    .score {
      flex: 1;
      margin: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: #34495e;
      border-radius: 0.5rem;

      &-title {
        font-size: 1rem;
        font-weight: bold;
        color: #b4c6cc;
      }

      &-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #8ebccc;
      }
    }

    .newgame-button {
      flex: 1;
      margin: 1rem;
      font-size: 1rem;
      font-weight: bold;
      padding: 0.5rem 1rem;
      color: #b4c6cc;
      background-color: #34495e;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      outline: none;
      
      &:hover {
        background-color: #2e4e6b;
      }
    }
  }
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
