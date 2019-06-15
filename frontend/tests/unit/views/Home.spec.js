import { assert } from 'chai';

import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import WordSnake from '@/components/WordSnake.vue';

describe('Home.vue', () => {
  it('should have at least 5 inputs', () => {
    const w = mount(Home);

    assert.isAtLeast(w.findAll('input').length, 5, '< 5 inputs');
  });

  it('should contain WordSnake', () => {
    const w = mount(Home);
    assert.isOk(w.find(WordSnake).exists());
  });

  it('should send correct props to WordSnake component', () => {
    const w = mount(Home);
    const ws = w.find(WordSnake);

    assert.equal(w.vm.height, ws.vm.height, 'height differs');
    assert.equal(w.vm.width, ws.vm.width, 'width differs');
    assert.deepEqual(w.vm.words, ws.vm.words, 'words differ');

    w.vm.heightInput = '50';
    w.vm.widthInput = '40';
    w.vm.words = ['NOPE', 'EPON', 'NOPE'];

    assert.equal(w.vm.height, ws.vm.height, 'height differs after change');
    assert.equal(w.vm.width, ws.vm.width, 'width differs after change');
    assert.deepEqual(w.vm.words, ws.vm.words, 'words differ after change');
  });
});
