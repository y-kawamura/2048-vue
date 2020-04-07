<template>
  <div class="tile-outer">
    <div
      v-if="tile"
      class="tile"
      :class="[
        { popup: isPopup, 'popup-merge': isPopupMerge },
        `tile-${tile.value}`,
        `${slideInAnimation}`,
      ]"
      @animationend="onAnimationEnd"
    >
      <span>{{ tile.value }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['tile'],
  data() {
    return {
      donePopupAnimation: false,
      donePopupMergeAnimation: false,
      doneSlideAnimation: false,
    };
  },
  computed: {
    ...mapState(['moveCount']),
    isPopup() {
      return !this.donePopupAnimation && !this.tile.previous;
    },
    // Note: animation is triggered after slide animation is done
    isPopupMerge() {
      return !this.donePopupMergeAnimation && this.tile.merged;
    },
    isSlide() {
      return (
        !this.doneSlideAnimation &&
        this.tile.previous &&
        (this.tile.previous.x !== this.tile.x ||
          this.tile.previous.y !== this.tile.y)
      );
    },
    slideInAnimation() {
      if (!this.isSlide) {
        return '';
      }
      const x = this.tile.previous.x - this.tile.x;
      const y = this.tile.previous.y - this.tile.y;
      return `slide_${x}x_${y}y`;
    },
  },
  methods: {
    onAnimationEnd(e) {
      if (e.animationName === 'popup') {
        this.donePopupAnimation = true;
      }
      if (e.animationName === 'popup-merge') {
        this.donePopupMergeAnimation = true;
      }
      if (e.animationName.match(/^slide/)) {
        this.doneSlideAnimation = true;
      }
    },
    startAnimation() {
      this.donePopupAnimation = false;
      this.donePopupMergeAnimation = false;
      this.doneSlideAnimation = false;
    },
  },
  watch: {
    // to restart animation
    moveCount() {
      this.startAnimation();
    },
  },
  mounted() {
    this.$store.subscribeAction(action => {
      if (action.type === 'resetBoard') {
        this.startAnimation();
      }
    });
  },
};
</script>

<style lang="scss">
$cellSize: 5rem;
$margin: 0.5rem;
$popup-animation-time: 200ms;
$move-animation-time: 100ms;

.tile-outer {
  width: $cellSize;
  height: $cellSize;
  margin: $margin;
  border-radius: 0.5rem;
  background-color: #393a41;
}

.tile {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #eee;
}

.popup {
  transform: scale(0);
  animation: popup $popup-animation-time $move-animation-time;
}
.popup-merge {
  animation: popup-merge $popup-animation-time;
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
@keyframes popup-merge {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@function distance($value) {
  @return $cellSize * $value + $margin * $value;
}

@for $x from -3 through 3 {
  .slide_#{$x}x_0y {
    animation: slide_#{$x}x_0y $move-animation-time;
  }
  @keyframes slide_#{$x}x_0y {
    0% {
      transform: translate(distance($x), 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
}

@for $y from -3 through 3 {
  .slide_0x_#{$y}y {
    animation: slide_0x_#{$y}y $move-animation-time;
  }
  @keyframes slide_0x_#{$y}y {
    0% {
      transform: translate(0, distance($y));
    }
    100% {
      transform: translate(0, 0);
    }
  }
}

// color table
.tile-2 {
  background-color: #bcd2e8;
  color: #000;
}
.tile-4 {
  background-color: #91bad6;
}
.tile-8 {
  background-color: #73a5c6;
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
</style>
