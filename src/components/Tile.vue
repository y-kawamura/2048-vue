<template>
  <div class="tile">
    <span v-if="tile">{{ tile.value }}</span>
  </div>
</template>

<script>
export default {
  props: ['tile'],
}
</script>

<style lang="scss">
.tile {
  width: 80px;
  height: 80px;
  background-color: #ecf0f1;
  margin: 0.5rem;
  border-radius: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;

  color: #000;
}

// #4b59f1
</style>