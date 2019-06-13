<template>
  <pre>{{snakeString}}</pre>
</template>
<script>
import { matrix } from '@/util';

const directions = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

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
    snakeDirs() {
      return this.solveDirs(
        this.width,
        this.height,
        this.words.map(
          (w, i) => i === 0 ? w.length : w.length - 1));
    },
    snakeMatrix() {
      return this.solveMatrix(matrix(this.width, this.height, ' '), [...this.words]);
    },
    snakeString() {
      if (!this.snakeMatrix) {
        return "couldn't generate a matrix";
      }
      return this.snakeMatrix.map(line => line.join('')).join('\n');
    },
  },
  methods: {
    solveDirs(w, h, [length, ...lengths], pos={x: 0, y: 0}, dir=0) {
      const m = matrix(w, h, 0);
    },
    solveMatrix(m, words) {

      const tip = { x: -1, y: 0 };
      const dir = 0;
      
    },
    stepMatrix(m, [word, ...words], { x, y }, dir) {
      
    },
  },
};
</script>
<style scoped>
</style>
