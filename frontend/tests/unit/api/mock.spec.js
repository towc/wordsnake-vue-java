import { assert } from 'chai';

import { range } from '@/util';

import api from '@/api/mock';
import realApi from '@/api/real';

describe('mock-api', () => {
  it('should contain all properties from real api', () => {
    assert.containsAllKeys(api, realApi);
  });

  describe('util', () => {
    it('isCustomWord should identify ABBXA strings', () => {
      const { isCustomWord } = api.util;

      const words = ['AXA', 'ABXA', 'ABBBXA', 'ABBBBBBBBBBBXA'];

      words.forEach((word) => {
        assert.isOk(isCustomWord(word), `false negative for ${word}`);
      });
    });
    it('isCustomWord should reject non-ABBXA strings', () => {
      const { isCustomWord } = api.util;

      const words = ['AA', 'ABA', 'XYZ', 'AXXA', 'AXBA', 'axa', 'abxa'];

      words.forEach((word) => {
        assert.isNotOk(isCustomWord(word), `false positive for ${word}`);
      });
    });

    // X is for making sure direction is right
    it('createWord should create ABBXA strings', () => {
      const { createWord, isCustomWord } = api.util;

      assert.isFunction(createWord);

      range(3, 20).forEach((i) => {
        assert.lengthOf(createWord(i), i, `length mismatch for ${i}`);
        assert.isOk(isCustomWord(createWord(i)), `generated invalid word for length ${i}`);
      });
    });
  });

  describe('get words by (count, min, max)', () => {
    it('should match count', async () => {
      assert.lengthOf(await api.getWordsByCountAndRange(10, 3, 5), 10);
      assert.lengthOf(await api.getWordsByCountAndRange(12, 3, 8), 12);
    });

    it('should be all ABBBXA strings', async () => {
      const { isCustomWord } = api.util;

      (await api.getWordsByCountAndRange(100, 3, 20))
        .forEach((word) => {
          assert.isOk(isCustomWord(word), `generated invalid word ${word}`);
        });
    });
  });
});
