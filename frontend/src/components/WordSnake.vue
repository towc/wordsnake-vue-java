<template>
  <pre
    v-if="snakeMatrix"
    class="snake snake-success"
  >{{snakeString}}</pre>
  <pre
    v-else
    class="snake snake-error"
  >
    Couldn't generate a matrix with:
    - size {{width}}x{{height}}
    - words:
        {{words.join('\n      ')}}
  </pre>
</template>
<script>
import { matrixToString } from '@/util';
import { createWordSnakeMatrix } from '@/util/wordSnake';

export default {
  name: '',
  components: {},
  props: {
    words: {
      type: Array,
      default: () => ['WORDSNAKE'],
    },
    width: {
      type: Number,
      default: () => 30,
    },
    height: {
      type: Number,
      default: () => 20,
    },
  },
  computed: {
    snakeMatrix() {
      return createWordSnakeMatrix(this.width, this.height, this.words);
    },
    snakeString() {
      if (!this.snakeMatrix) {
        return false;
      }

      return matrixToString(this.snakeMatrix);
    },
  },
};
</script>
<style scoped>
.snake {
  text-align: left;
  width: fit-content;
  margin: auto;
}
.snake-success {
  line-height: 14px;
  letter-spacing: 5px;
}
.snake-error {
  color: #b55;
}
</style>
