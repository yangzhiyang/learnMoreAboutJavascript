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
  it('new Promise(fn) 会生成一个带有 then 方法的对象', () => {
    const promise = new Promise(() => {});
    assert.isFunction(promise.then)
  });
  it('new Promise(fn) 中传入的 fn 立即执行', () => {
    let called = false;
    const promise = new Promise(() => {
      called = true;
    });
    assert.isTrue(called);
  });
  it('fn 接收 resolve、reject 两个函数', () => {
    let called = false;
    const promise = new Promise((resolve, reject) => {
      called = true;
      assert.isFunction(resolve);
      assert.isFunction(reject);
    });
    assert.isTrue(called);
  });

})

