import * as chai from 'chai';
import Promise from '../src/promise';

const assert = chai.assert;

describe('Promise', () => {
  it('是一个类', () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  });
  it('new Promise() 必须接收一个函数', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise();
    });
    assert.throw(() => {
      // @ts-ignore
      new Promise(1);
    });
    assert.throw(() => {
      // @ts-ignore
      new Promise(true);
    });
    assert.throw(() => {
      // @ts-ignore
      new Promise('promise');
    });
  });
})

