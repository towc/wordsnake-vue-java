import {
  matrix, cloneMatrix, mapMatrix, range,
} from '@/util';

export const dirs = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];
[dirs.RIGHT, dirs.DOWN, dirs.LEFT, dirs.UP] = range(4);

export const stepMatrix = (om, len, dirIndex, pos, count) => {
  const m = cloneMatrix(om);

  const w = m[0].length;
  const h = m.length;

  const dir = dirs[dirIndex];
  let { x, y } = pos;

  for (let i = 0; i < len; i += 1) {
    if (x < 0 || x >= w || y < 0 || y >= h || m[y][x]) {
      return false;
    }

    m[y][x] = count + i;

    x += dir.x;
    y += dir.y;
  }

  return m;
};

export const solveMatrix = (
  m,
  lens,
  availDirs = [dirs.RIGHT, dirs.DOWN],
  pos = { x: 0, y: 0 },
  count = 1,
) => {
  if (lens.length === 0) {
    return m;
  }

  const [len, ...nextLens] = lens;

  // eslint-disable-next-line no-restricted-syntax
  for (const dirIndex of availDirs) {
    const dir = dirs[dirIndex];

    const stepped = stepMatrix(
      m,
      len,
      dirIndex,
      count === 1 ? pos : {
        x: pos.x + dir.x,
        y: pos.y + dir.y,
      },
      count,
    );

    if (stepped) {
      const res = solveMatrix(
        stepped,
        nextLens,
        [
          (dirIndex + 1) % 4,
          (dirIndex + 3) % 4,
        ],
        {
          x: pos.x + dir.x * (count === 1 ? len - 1 : len),
          y: pos.y + dir.y * (count === 1 ? len - 1 : len),
        },
        count + len,
      );

      if (res) {
        return res;
      }
    }
  }

  return false;
};

export const numMatrixToWordChars = (m, words) => {
  if (!m) {
    return false;
  }
  const charMap = words.map((w, i) => (i === 0 ? w : w.substring(1))).join('');
  return mapMatrix(m, x => (x === 0 ? ' ' : charMap[x - 1]));
};
export const createWordSnakeMatrix = (w, h, words) => numMatrixToWordChars(
  solveMatrix(
    matrix(w, h, 0),
    words.map((x, i) => (i === 0 ? x.length : x.length - 1)),
  ),
  words,
);
