import { assert } from 'chai';

import { matrix, mapMatrix, someMatrix } from '@/util';
import * as wordSnakeUtil from '@/util/wordSnake';

describe('util/wordSnake', () => {
  describe('stepMatrix', () => {
    const { stepMatrix, dirs } = wordSnakeUtil;

    it('should return a stepped matrix, or false if not possible', () => {
      const emptyMatrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const topRightFilledMatrix = [
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const spos = { x: 0, y: 0 };

      const tests = [
        {
          args: [matrix(2, 2, 0), 3, dirs.RIGHT, spos, 1],
          res: false,
          msg: 'overflow right on 2x2 matrix',
        }, {
          args: [emptyMatrix, 2, dirs.RIGHT, spos, 1],
          res: [
            [1, 2, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          msg: 'base on empty matrix',
        }, {
          args: [emptyMatrix, 3, dirs.DOWN, spos, 1],
          res: [
            [1, 0, 0],
            [2, 0, 0],
            [3, 0, 0],
          ],
          msg: 'down on empty matrix, up to edge',
        }, {
          args: [emptyMatrix, 4, dirs.RIGHT, spos, 1],
          res: false,
          msg: 'overflow right',
        }, {
          args: [emptyMatrix, 2, dirs.LEFT, { x: 1, y: 1 }, 1],
          res: [
            [0, 0, 0],
            [2, 1, 0],
            [0, 0, 0],
          ],
          msg: 'left from center',
        }, {
          args: [emptyMatrix, 3, dirs.UP, { x: 1, y: 2 }, 1],
          res: [
            [0, 3, 0],
            [0, 2, 0],
            [0, 1, 0],
          ],
          msg: 'up from bottom center',
        }, {
          args: [emptyMatrix, 3, dirs.UP, { x: 1, y: 2 }, 5],
          res: [
            [0, 7, 0],
            [0, 6, 0],
            [0, 5, 0],
          ],
          msg: 'up from bottom center, with non-1 count',
        }, {
          args: [topRightFilledMatrix, 2, dirs.RIGHT, spos, 2],
          res: [
            [2, 3, 1],
            [0, 0, 0],
            [0, 0, 0],
          ],
          msg: 'non-colliding top-right-filled matrix',
        }, {
          args: [topRightFilledMatrix, 3, dirs.RIGHT, spos, 2],
          res: false,
          msg: 'colliding top-right-filled matrix',
        },
      ];

      tests.forEach(({ args, res, msg }) => {
        assert.deepEqual(stepMatrix(...args), res, msg);
      });
    });
  });

  describe('solveMatrix', () => {
    const { solveMatrix } = wordSnakeUtil;

    // this is rather implementation-dependent
    // implementation prefers:
    // - order of RIGHT,DOWN,LEFT,UP
    // - deterministic

    it('should return a solved matrix, or false if not possible', () => {
      const emptyMatrix = matrix(3, 3, 0);

      const tests = [
        {
          args: [matrix(2, 2, 0), [3]],
          res: false,
          msg: 'overflow right on 2x2 with single word of length 3',
        }, {
          args: [emptyMatrix, [3]],
          res: [
            [1, 2, 3],
            [0, 0, 0],
            [0, 0, 0],
          ],
          msg: 'put one word in matrix',
        }, {
          args: [emptyMatrix, [3, 2]],
          res: [
            [1, 2, 3],
            [0, 0, 4],
            [0, 0, 5],
          ],
          msg: 'put two words in matrix',
        }, {
          args: [emptyMatrix, [3, 2, 2, 1, 1]],
          res: [
            [1, 2, 3],
            [8, 9, 4],
            [7, 6, 5],
          ],
          msg: 'fill empty matrix',
        }, {
          args: [emptyMatrix, [3, 2, 2, 1, 1, 1]],
          res: false,
          msg: 'fill empty matrix, and add 1',
        }, {
          args: [matrix(3, 4, 0), [4, 2, 2, 1]],
          res: [
            [1, 0, 0],
            [2, 9, 8],
            [3, 0, 7],
            [4, 5, 6],
          ],
          msg: 'force different turns on 3x4 matrix',
        },
      ];

      tests.forEach(({ args, res, msg }) => {
        assert.deepEqual(solveMatrix(...args), res, msg);
      });
    });
  });

  describe('numMatrixToWordChars', () => {
    const { numMatrixToWordChars } = wordSnakeUtil;

    it('should return false for a non-truthy matrix', () => {
      assert.isNotOk(numMatrixToWordChars(false, ['abc']));
    });

    it('should map a solved matrix to chars of the words', () => {
      assert.deepEqual(numMatrixToWordChars([
        [1, 2, 3],
        [0, 0, 0],
        [0, 0, 0],
      ], ['abc']), [
        ['a', 'b', 'c'],
        [' ', ' ', ' '],
        [' ', ' ', ' '],
      ], 'single word 3x3');

      assert.deepEqual(numMatrixToWordChars([
        [1, 2, 3],
        [0, 0, 4],
        [0, 0, 5],
      ], ['abc', 'cde']), [
        ['a', 'b', 'c'],
        [' ', ' ', 'd'],
        [' ', ' ', 'e'],
      ], 'two words 3x3');

      assert.deepEqual(numMatrixToWordChars([
        [1, 2, 3],
        [8, 9, 4],
        [7, 6, 5],
      ], ['abc', 'cde', 'efg', 'gh', 'hi']), [
        ['a', 'b', 'c'],
        ['h', 'i', 'd'],
        ['g', 'f', 'e'],
      ], 'filled 3x3');
    });
  });

  describe('createWordSnakeMatrix', () => {
    const { createWordSnakeMatrix } = wordSnakeUtil;

    it('should create a char matrix of letters from the words', () => {
      const words = ['you', 'under', 'represented', 'domain', 'name'];
      const chars = `${words.join('')} `;

      const m = createWordSnakeMatrix(30, 40, words);
      mapMatrix(m, (i) => {
        assert.lengthOf(i, 1, 'item length should be 1');
        assert.typeOf(i, 'string', 'item type should be string');
        assert.include(chars, i, 'item should be part of chars of original words');
      });

      chars.split('').forEach((c) => {
        assert.isOk(someMatrix(m, i => i === c), `letter ${c} should be included`);
      });
    });

    it('should return false for impossible snakes', () => {
      assert.isNotOk(createWordSnakeMatrix(2, 2, ['hey']), 'word should not be able to fit');
    });
  });
});
