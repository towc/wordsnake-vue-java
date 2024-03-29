import { assert } from 'chai';

import * as util from '@/util';

describe('util', () => {
  describe('last', () => {
    const { last } = util;

    it('should return the last element of an array', () => {
      assert.equal(last([1, 2]), 2, 'was not last');
      assert.equal(last([0, 1, 8]), 8, 'was not last');
    });

    it('should return the last char of a string', () => {
      assert.equal(last('abc'), 'c', 'was not last');
      assert.equal(last('def'), 'f', 'was not last');
    });
  });

  describe('first', () => {
    const { first } = util;

    it('should return the first element of an array', () => {
      assert.equal(first([2, 1]), 2, 'was not last');
      assert.equal(first([8, 1, 0]), 8, 'was not last');
    });

    it('should return the first char of a string', () => {
      assert.equal(first('abc'), 'a', 'was not first');
      assert.equal(first('def'), 'd', 'was not first');
    });
  });

  describe('isInt', () => {
    const { isInt } = util;

    it('should work for numbers', () => {
      assert.isOk(isInt(1), 'was int');
      assert.isOk(isInt(2), 'was int');
      assert.isOk(isInt(15234), 'was int');

      assert.isNotOk(isInt(1.2), 'was not int');
      assert.isNotOk(isInt(2.6), 'was not int');
      assert.isNotOk(isInt(15234.1423), 'was not int');
    });

    // unspecified behaviour for non-numbers
  });

  describe('varArg', () => {
    const { varArg } = util;

    /* eslint-disable no-unused-vars */

    it('should call the right function', () => {
      let fn = varArg([
        a => 1,
        (a, b) => 2,
        (a, b, c) => 3,
        (a, b, c, d) => 4,
      ]);

      assert.equal(fn(0), 1, 'failed for args = 1');
      assert.equal(fn(0, 0), 2, 'failed for args = 2');
      assert.equal(fn(0, 0, 0), 3, 'failed for args = 3');
      assert.equal(fn(0, 0, 0, 0), 4, 'failed for args = 4');

      fn = varArg([
        a => 1,
        (a, b, c) => 10,
      ]);

      assert.equal(fn(0, 0, 0), 10, 'failed when skipping some lengths');

      fn = varArg([
        (a, b, c, d) => 4,
        (a, b, c) => 3,
        (a, b) => 2,
        a => 1,
      ]);

      assert.equal(fn(0), 1, 'failed for args = 1, inverted order');
      assert.equal(fn(0, 0), 2, 'failed for args = 2, inverted order');
      assert.equal(fn(0, 0, 0), 3, 'failed for args = 3, inverted order');
      assert.equal(fn(0, 0, 0, 0), 4, 'failed for args = 4, inverted order');
    });

    it('should throw for invalid length', () => {
      const fn = varArg([
        a => 1,
        (a, b, c) => 10,
      ]);

      assert.throws(() => fn(0, 0), /.*invalid argument count.*/, 'did not throw for length = 2, when avail are 1,3');
    });

    /* eslint-enable no-unused-vars */
  });

  describe('range', () => {
    const { range, last, first } = util;

    it('should create an array of indices with (count)', () => {
      assert.lengthOf(range(10), 10, 'bad length');
      assert.lengthOf(range(47), 47, 'bad length');
      assert.lengthOf(range(-10), 0, 'bad length');

      assert.equal(first(range(10)), 0, 'not starts with 0');
      assert.equal(last(range(10)), 9, 'not ends with count-1');

      assert.equal(range(10)[1], 1, 'index not matches with element');
      assert.equal(range(10)[5], 5, 'index not matches with element');
    });

    it('should create an array of ints between/including min and max with (min, max)', () => {
      assert.lengthOf(range(3, 7), 5, 'bad length');
      assert.lengthOf(range(30, 70), 41, 'bad length');
      assert.lengthOf(range(7, 3), 0, 'bad length for max > min');

      assert.equal(first(range(3, 7)), 3, 'not starts with min');
      assert.equal(last(range(3, 7)), 7, 'not ends with max');

      assert.equal(range(3, 7)[2], 5, 'element not matches');

      assert.deepEqual(range(10), range(0, 9), 'range(0, count-1) not equals range(count)');
    });

    it('should create an array of ints between/including min and max, spaced by inc with (min, max, inc)', () => {
      assert.lengthOf(range(3, 7, 2), 3, 'bad length');
      assert.lengthOf(range(30, 70, 20), 3, 'bad length');
      assert.lengthOf(range(30, 70, 2), 21, 'bad length');

      assert.lengthOf(range(7, 3, 2), 0, 'bad length for max > min');
      assert.lengthOf(range(7, 3, -2), 3, 'bad length for max > min, inc < 0');

      assert.equal(first(range(3, 7, 2)), 3, 'not starts with min');
      assert.equal(last(range(3, 7, 2)), 7, 'not ends with max');

      assert.equal(range(3, 7, 2)[1], 5, 'element not matches');

      assert.equal(first(range(7, 3, -2)), 7, 'element not matches for max > min, inc < 0');
    });
    it('should approximate for badly matching (min, max, inc)', () => {
      assert.lengthOf(range(3, 6, 2), 2, 'bad length');
      assert.equal(first(range(3, 6, 2)), 3, 'should start with min');
      assert.equal(last(range(3, 6, 2)), 5, 'shouldn\'t end with max');
    });
  });

  describe('matrix', () => {
    const { matrix, range } = util;
    it('should create a WxH matrix with (w, h)', () => {
      const sizes = [
        [2, 2],
        [3, 3],
        [2, 3],
        [3, 2],
        [10, 20],
        [100, 242],
      ];

      sizes.forEach(([w, h]) => {
        const m = matrix(w, h);

        assert.lengthOf(m, h, `bad height for size ${w}x${h}`);
        range(h).forEach((y) => {
          assert.lengthOf(m[y], w, `bad width for size ${w}x${h} at row ${y}`);
        });
      });
    });

    it('should fill a WxH matrix with F for (w, h, f)', () => {
      const params = [
        [20, 30, 8],
        [10, 5, 'hi'],
        [40, 3, [1, 2, 3]], // yes, reference is kept
      ];

      params.forEach(([w, h, f]) => {
        const m = matrix(w, h, f);
        range(w).forEach((x) => {
          range(h).forEach((y) => {
            assert.equal(m[y][x], f, `not filled with ${f} at ${x},${y} for matrix ${w}x${h}`);
          });
        });
      });
    });

    describe('matrixToString', () => {
      const { matrixToString } = util;
      it('should concatenate items as strings, separated by newlines for (matrix)', () => {
        assert.equal(matrixToString(matrix(2, 2, 'x')), 'xx\nxx', 'failed for 2x2 of char');
        assert.equal(matrixToString(matrix(2, 3, 'x')), 'xx\nxx\nxx', 'failed for 2x3 of char');
        assert.equal(matrixToString(matrix(2, 3, 1)), '11\n11\n11', 'failed for 2x3 of num');
        assert.equal(matrixToString([]), '', 'failed for 0x0');
        assert.lengthOf(matrixToString(matrix(100, 90, 'y')), (100 + 1) * 90 - 1, 'bad length for 100x90');
      });

      it('should fill falsey values with filler for (matrix, filler)', () => {
        assert.equal(matrixToString([[1, 0], [0, 1]], ' '), '1 \n 1', 'failed for 2x2 of num, char filler');
      });

      it('should throw if arg is not a matrix-like', () => {
        assert.throws(() => matrixToString('hi'), Error, /.*/, 'did not throw for string argument');
        assert.throws(() => matrixToString(['hi']), Error, /.*/, 'did not throw for string array argument');
        // [[]] is matrix-like, with current implementation
      });
    });

    describe('mapMatrix', () => {
      const { mapMatrix } = util;

      it('should map every element to create a new matrix', () => {
        assert.deepEqual(mapMatrix(matrix(7, 10, 3), x => x + 3), matrix(7, 10, 6), 'increase all numbers');
      });
    });

    describe('everyMatrix', () => {
      const { everyMatrix, mapMatrix } = util;

      it('should return whether every item in the matrix matches the predicate', () => {
        assert.isOk(everyMatrix(matrix(3, 5, 'hi'), x => x === 'hi'), 'homogenous matrix');
        assert.isOk(everyMatrix(mapMatrix(matrix(3, 5), (_, x, y) => x + y), (i, x, y) => i === x + y), 'x + y matrix');
      });
    });

    describe('someMatrix', () => {
      const { someMatrix } = util;

      it('should return whether any item in the matrix matches the predicate', () => {
        assert.isNotOk(someMatrix(matrix(3, 5, 'hi'), x => x !== 'hi'), 'non-presence in homogenous matrix');
        assert.isOk(someMatrix([[0, 0], [0, 1]], x => x === 1), 'presence in non-homogenous matrix');
      });
    });

    describe('cloneMatrix', () => {
      const { cloneMatrix } = util;

      it('should create a matrix idential to previous', () => {
        let m = matrix(5, 10, 'y');
        assert.deepEqual(cloneMatrix(m), m, 'fails for homogenous matrix');
        m = [[1, 0], [0, 1]];
        assert.deepEqual(cloneMatrix(m), m, 'fails for non-homogenous matrix');
      });

      it('should create a matrix with different references', () => {
        const m = matrix(5, 10, 'y');
        assert.notStrictEqual(cloneMatrix(m), m, 'matrices are reference-equal');
        assert.notStrictEqual(cloneMatrix(m)[0], m[0], 'matrix rows are reference-equal');
      });
    });
  });

  describe('random', () => {
    const {
      random, randomInt, range, isInt,
    } = util;

    it('should create a number in [0, max] for (max)', () => {
      range(0, 100).forEach(() => {
        assert.isAtMost(random(10), 10, 'exceeded max');
        assert.isAtLeast(random(10), 0, 'went below 0');
      });
    });
    it('int - should create an int in [0, max] for (max)', () => {
      range(0, 100).forEach(() => {
        assert.isAtMost(randomInt(10), 10, 'exceeded max');
        assert.isAtLeast(randomInt(10), 0, 'went below 0');
        assert.isOk(isInt(randomInt(10)), 'was not int');
      });
    });

    it('should create a number in [min, max] for (min, max)', () => {
      range(0, 100).forEach(() => {
        assert.isAtMost(random(3, 20), 20, 'exceeded max');
        assert.isAtLeast(random(3, 20), 3, 'went below min');
      });
    });
    it('int - should create an int in [min, max] for (min, max)', () => {
      range(0, 100).forEach(() => {
        assert.isAtMost(randomInt(3, 20), 20, 'exceeded max');
        assert.isAtLeast(randomInt(3, 20), 3, 'went below min');
        assert.isOk(isInt(randomInt(3, 20)), 'was not int');
      });
    });
  });
});
