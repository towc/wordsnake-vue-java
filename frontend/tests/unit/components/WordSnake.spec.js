import { assert } from 'chai';

import { mount } from '@vue/test-utils';
import WordSnake from '@/components/WordSnake.vue';

describe('WordSnake', () => {
  it('should have appropriate props', () => {
    const ws = mount(WordSnake);

    assert.containsAllKeys(ws.props(), ['words', 'width', 'height'], 'missing some props');
  });

  it('should produce a matrix of the right size', () => {
    const sizes = [
      [10, 20],
      [20, 10],
      [15, 15],
      [123, 534],
    ];

    sizes.forEach(([width, height]) => {
      const ws = mount(WordSnake, {
        propsData: {
          width,
          height,
        },
      });

      assert.isOk(ws.vm.snakeMatrix, `there is no snakeMatrix for ${width}x${height}`);
      assert.lengthOf(ws.vm.snakeMatrix, height, `bad height for ${width}x${height}`);
      assert.lengthOf(ws.vm.snakeMatrix[0], width, `bad width for ${width}x${height}`);
    });
  });

  it('should create a string reflecting matrix size', () => {
    const sizes = [
      [10, 20],
      [20, 10],
      [15, 15],
      [123, 534],
    ];

    sizes.forEach(([width, height]) => {
      const ws = mount(WordSnake, {
        propsData: {
          width,
          height,
        },
      });

      // width+1 = chars + `\n`
      // -1 = no need for last `\n`

      assert.lengthOf(ws.vm.snakeString, (width + 1) * height - 1, `bad length for ${width}x${height}`);
    });
  });
});
