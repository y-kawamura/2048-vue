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
    this.$store.subscribeAction((action) => {
      if (action.type === 'resetBoard') {
        this.startAnimation();
      }
    });
  },
};
</script>

<style lang="scss">
$cell-margin: 0.5rem;

$cell-size-xs: 4rem;
$cell-size: 5rem;

$numberSize-xs: 1.5rem;
$number4digitSize-xs: 1.2rem;
$numberSize: 2rem;
$number4digitSize: 1.5rem;

$popup-animation-time: 200ms;
$move-animation-time: 100ms;

$bp-smartphone: 520px;

@mixin smartphone {
  @media ( max-width: #{$bp-smartphone} ) {
    @content;
  }
}

.tile-outer {
  width: $cell-size;
  height: $cell-size;

  @include smartphone {
    width: $cell-size-xs;
    height: $cell-size-xs;
  }

  margin: $cell-margin;
  border-radius: 0.5rem;
  background-color: #393a41;
}

.tile {
  font-size: $numberSize;
  @include smartphone {
    font-size: $numberSize-xs;
  }

  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

@function previosTilePosition($cell-size, $value) {
  @return ($cell-size + $cell-margin) * $value;
}

@for $x from -3 through 3 {
  .slide_#{$x}x_0y {
    animation: slide_#{$x}x_0y $move-animation-time;
  }
  @keyframes slide_#{$x}x_0y {
    0% {
      transform: translate(previosTilePosition($cell-size, $x), 0);
      @include smartphone {
        transform: translate(0, previosTilePosition($cell-size-xs, $x), 0);
      }
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
      transform: translate(0, previosTilePosition($cell-size, $y));
      @include smartphone {
        transform: translate(0, previosTilePosition($cell-size-xs, $y));
      }
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
  font-size: $number4digitSize;
  @include smartphone {
    font-size: $number4digitSize-xs;
  }
}
.tile-2048 {
  background-color: #1b63e9;
  font-size: $number4digitSize;
  @include smartphone {
    font-size: $number4digitSize-xs;
  }
}
</style>
