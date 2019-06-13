import config from '@/config';
import {
  range, randomInt, first, last,
} from '@/util';

// wait for [40,140] ms, or 0 if node_env is testing
const networkDelay = config.testing
  ? () => new Promise(res => setTimeout(res, 40 + Math.random() * 100))
  : () => Promise.resolve();

// creates ABBBBBXA strings, errors if length <3
const createWord = len => `A${'B'.repeat(len - 3)}XA`;

const isCustomWord = (str) => {
  if (first(str) !== 'A' || last(str) !== 'A' || str[str.length - 2] !== 'X') {
    return false;
  }

  return str.substring(1, str.length - 2).split('')
    .every(char => char === 'B');
};

export default {
  mocked: true,

  // testables
  util: {
    networkDelay,
    isCustomWord,
    createWord,
  },

  async getWordsByCountAndRange(count, min, max) {
    await networkDelay();
    return range(count).map(() => createWord(randomInt(min, max)));
  },

  async getWordsByLengths(lengths) {
    await networkDelay();
    return lengths.map(length => createWord(length));
  },
};
