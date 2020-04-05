<template>
  <div class="tile-outer">
    <div
      v-if="tile"
      class="tile"
      :class="[{ popup: isPopup }, `tile-${tile.value}`]"
      @animationend="animated = true"
    >
      <span>{{ tile.value }}</span>
    </div>
    <div v-else class="tile tile-white"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['tile'],
  data() {
    return {
      animated: false,
    };
  },
  computed: {
    ...mapState(['moveCount']),
    isPopup() {
      console.log(
        this.tile.x,
        this.tile.y,
        !this.animated,
        !this.tile.previous,
        this.tile.merged
      );

      return !this.animated && (!this.tile.previous || this.tile.merged);
    },
  },
  methods: {
    removeClass(item) {
      item.highlight = false;
    },
  },
  watch: {
    moveCount() {
      this.animated = false;
    },
  },
};
</script>

<style lang="scss">
.tile-outer {
  width: 80px;
  height: 80px;
  margin: 0.5rem;
  border-radius: 0.5rem;


  color: eee;
}

.tile {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.tile-white {
  background-color: #fcfcfc;
}

.tile-2 {
  background-color: #BCD2E8;
  color:#000;
}
.tile-4 {
  background-color: #91BAD6;
}
.tile-8 {
  background-color: #73A5C6;
}
.tile-16 {
  background-color: #57a0d3;
}
.tile-32 {
  background-color: #57a6f5;
}
.tile-64 {
  background-color: #4674b9;
}
.tile-128 {
  background-color: #365597;
}
.tile-256 {
  background-color: #769ee9;
}
.tile-512 {
  background-color: #6372c9;
}
.tile-1024 {
  background-color: #476be2;
  font-size: 1.5rem;
}
.tile-2048 {
  background-color: #1b63e9;
  font-size: 1.5rem;
}

.popup {
  animation: popup 0.5s;
}

@keyframes popup {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

// #4b59f1
</style>
