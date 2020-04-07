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
        <div v-if="gameover" class="result gameover">
          Game Over
        </div>
        <div v-if="winner" class="result winner">
          You Win
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Tile from './Tile';
import { GRID_SIZE } from '@/config';

export default {
  components: {
    Tile,
  },
  data() {
    return {
      gameover: false,
      winner: false,
      touchStartX: 0,
      touchStartY: 0,
    };
  },
  computed: {
    ...mapState(['cells', 'moved', 'score']),
    ...mapGetters(['canMove', 'has2048']),
    cellIndex() {
      return (x, y) => y * GRID_SIZE + x;
    },
  },
  methods: {
    ...mapActions(['addNewTile', 'moveTile', 'resetBoard']),
    setup() {
      this.addNewTile();
      this.addNewTile();
    },
    newGame() {
      this.gameover = false;
      this.winner = false;
      this.resetBoard();
      this.setup();
    },
    move(direction) {
      if (this.gameover || this.winner) {
        return;
      }

      this.moveTile(direction);

      if (this.moved) {
        this.addNewTile();

        if (!this.canMove) {
          this.gameover = true;
        }

        if (this.has2048) {
          this.winner = true;
        }
      }
    },
  },
  mounted() {
    this.setup();

    // Add key event
    window.addEventListener('keydown', (e) => {
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
    });

    // Add swipe event
    window.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].pageX;
      this.touchStartY = e.touches[0].pageY;
    });
    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].pageX;
      const touchEndY = e.changedTouches[0].pageY;

      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
        const direction =
          absDx > absDy
            ? dx > 0
              ? 'right'
              : 'left'
            : dy > 0
              ? 'down'
              : 'up';
        this.move(direction);
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
  position: relative;
}

.row {
  display: flex;
}

.result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  opacity: 0.6;
  text-align: center;
}

.gameover {
  color: #f38e8a;
}
.winner {
  color: #fffc4a;
}
</style>
