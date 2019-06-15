import config from '@/config';

const request = path => fetch(`${config.api.baseUrl}${path}`).then(d => d.text());

const removeNoise = str => str.split('').filter(c => !config.api.noiseChars.includes(c)).join('');
const removeNulls = arr => arr.filter(str => str !== 'null');
const parseList = str => removeNulls(removeNoise(str).split(','));

export default {
  mocked: false,

  // testables
  util: {
    removeNoise,
    removeNulls,
    parseList,
  },

  async getWordsByCountAndRange(count, min, max) {
    return parseList(await request(`/words/count/${count}/range/${min}/${max}`));
  },
  async getWordsByLengths(lengths) {
    return parseList(await request(`/words/by-length/${lengths.join(',')}`));
  },
};
