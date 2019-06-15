<template>
  <div class="home container">
    <h1 class="title">Word Snake</h1>
    <div class="panels">
      <div class="controls">
        <h2 class="subtitle">Local</h2>
        <div class="field">
          <label class="label">width: {{width}}</label>
          <div class="control">
            <input
              type="range"
              v-model="widthInput"
              min=3
              max=80
            />
          </div>
        </div>
        <div class="field">
          <label class="label">height: {{height}}</label>
          <div class="control">
            <input
              type="range"
              v-model="heightInput"
              min=3
              max=80
            />
          </div>
        </div>
        <br>
        <h2 class="subtitle">Remote</h2>
        <div class="field">
          <label class="label">word count: {{wordCount}}</label>
          <div class="control">
            <input
              type="range"
              v-model="wordCountInput"
              min=1
              max=40
            />
          </div>
        </div>
        <div class="field">
          <label class="label">min word size: {{minWordSize}}</label>
          <div class="control">
            <input
              type="range"
              v-model="minWordSizeInput"
              min=3
              max=40
            />
          </div>
        </div>
        <div class="field">
          <label class="label">max word size: {{maxWordSize}}</label>
          <div class="control">
            <input
              type="range"
              v-model="maxWordSizeInput"
              min=3
              max=40
            />
          </div>
        </div>
        <button
          class="button"
          @click=fetchNewWords
          :disabled=waitingForResponse
        >Fetch New Words</button>
      </div>
      <WordSnake :width=width :height=height :words=words />
    </div>
  </div>
</template>

<script>
import WordSnake from '@/components/WordSnake.vue';
import api from '@/api';

export default {
  name: 'home',
  components: {
    WordSnake,
  },
  data() {
    return {
      widthInput: 30,
      heightInput: 30,

      words: ['THIS', 'SNAKE', 'ENDS', 'SOMEWHERE'],

      wordCountInput: 20,
      minWordSizeInput: 4,
      maxWordSizeInput: 11,

      waitingForResponse: false,
    };
  },
  computed: {
    width() { return Number(this.widthInput); },
    height() { return Number(this.heightInput); },
    wordCount() { return Number(this.wordCountInput); },
    minWordSize() { return Number(this.minWordSizeInput); },
    maxWordSize() { return Number(this.maxWordSizeInput); },
  },
  watch: {
    minWordSize() {
      if (this.minWordSize > this.maxWordSize) {
        this.maxWordSizeInput = this.minWordSize;
      }
    },
    maxWordSize() {
      if (this.minWordSize > this.maxWordSize) {
        this.minWordSizeInput = this.maxWordSize;
      }
    },
  },
  methods: {
    async fetchNewWords() {
      this.waitingForResponse = true;
      this.words = await api.getWordsByCountAndRange(
        this.wordCount, this.minWordSize, this.maxWordSize,
      );
      this.waitingForResponse = false;
    },
  },
};
</script>
<style scoped>
.panels {
  display: flex;
}
.controls {
  text-align: left;
}
</style>
