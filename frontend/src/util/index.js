export const last = arr => arr[arr.length - 1];
// define `first` for consistency with `last`
export const first = arr => arr[0];

export const isInt = x => x % 1 === 0;

export const varArg = (fns) => {
  const argCounts = fns.map(fn => fn.length);
  if ([...new Set(argCounts)].length !== fns.length) {
    throw new Error('some functions have the same number of arguments');
  }

  return (...args) => {
    const index = argCounts.indexOf(args.length);

    if (index < 0) {
      throw new Error(`invalid argument count ${args.length}. Available: ${argCounts.join(', ')}`);
    }

    return fns[index](...args);
  };
};

export const range = varArg([
  count => Array(Math.floor(Math.max(0, count))).fill().map((_, i) => i),
  (min, max) => range(max - min + 1).map(x => min + x),
  (min, max, inc) => range((max - min) / inc + 1).map(x => min + x * inc),
]);

export const matrix = varArg([
  (w, h) => matrix(w, h, 0),
  (w, h, f) => range(h).map(() => range(w).map(() => f)),
]);

export const matrixToString = varArg([
  m => m.map(l => l.join('')).join('\n'),
  (m, f) => m.map(l => l.map(x => (x || f)).join('')).join('\n'),
]);

export const mapMatrix = (m, f) => m.map((l, y) => l.map((i, x) => f(i, x, y)));
export const everyMatrix = (m, f) => m.every((l, y) => l.every((i, x) => f(i, x, y)));
export const someMatrix = (m, f) => m.some((l, y) => l.some((i, x) => f(i, x, y)));

export const cloneMatrix = m => mapMatrix(m, x => x);

export const random = varArg([
  max => Math.random() * max,
  (min, max) => min + Math.random() * (max - min),
]);


export const randomInt = varArg([
  max => Math.floor(random(max + 1)),
  (min, max) => Math.floor(random(min, max + 1)),
]);
