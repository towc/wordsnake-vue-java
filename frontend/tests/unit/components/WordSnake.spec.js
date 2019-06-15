import { assert } from 'chai';

import { mount } from '@vue/test-utils';
import WordSnake from '@/components/WordSnake.vue';

describe('WordSnake.vue', () => {
  it('should have appropriate props', () => {
    const ws = mount(WordSnake);

    assert.containsAllKeys(ws.props(), ['words', 'width', 'height'], 'missing some props');
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

  it('should display an error for impossible snakes', () => {
    const ws = mount(WordSnake, {
      propsData: {
        width: 2,
        height: 2,
        words: ['hey'],
      },
    });

    assert.isOk(ws.find('.snake-error').exists(), '.snake-error should be present');
    assert.isNotOk(ws.find('.snake-success').exists(), '.snake-success should not be present');
  });

  it('should display success for found snakes', () => {
    const ws = mount(WordSnake, {
      propsData: {
        width: 3,
        height: 2,
        words: ['hey'],
      },
    });

    assert.isOk(ws.find('.snake-success').exists(), '.snake-success should be present');
    assert.isNotOk(ws.find('.snake-error').exists(), '.snake-error should not be present');
  });
});
