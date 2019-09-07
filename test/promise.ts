import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import Promise from "../src/promise";

chai.use(sinonChai);

const assert = chai.assert;

describe("Promise", () => {
  it("是一个类", () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  });
  it("new Promise() 必须接收一个函数", () => {
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
      new Promise("promise");
    });
  });
  it("new Promise(fn) 会生成一个带有 then 方法的对象", () => {
    const promise = new Promise(() => {});
    assert.isFunction(promise.then);
  });
  it("new Promise(fn) 中传入的 fn 立即执行", () => {
    const fn = sinon.fake();
    new Promise(fn);
    assert(fn.called);
  });
  it("fn 接收 resolve、reject 两个函数", done => {
    new Promise((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    });
  });
  it("promise.then(onFulfilled) 中的 onFulfilled 会在 reslove 被调用的时候执行", done => {
    const onFulfilled = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(onFulfilled.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(onFulfilled.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(onFulfilled);
  });
  it("promise.then(null, onRejected) 中的 onRejected 会在 reject 被调用的时候执行", done => {
    const onRejected = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(onRejected.called);
      reject();
      setTimeout(() => {
        assert.isTrue(onRejected.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(null, onRejected);
  });
  it("如果 onFulfilled 不是函数，则必须忽略", () => {
    const promise = new Promise(resolve => {
      resolve();
    });
    promise.then(false);
  });
  it("如果 onRejected 不是函数，则必须忽略", () => {
    const promise = new Promise((resolve, onRejected) => {
      onRejected();
    });
    promise.then(false, null);
  });
  it(`onFulfilled 必须在 promise 完成(fulfilled)后被调用，
    并把 promise 的值作为它的第一个参数, 函数在promise完成(fulfilled)之前绝对不能被调用
    并不能被调用超过一次`, done => {
    const onFulfilled = sinon.fake();
    const promise = new Promise(resolve => {
      assert.isFalse(onFulfilled.called);
      resolve(123);
      resolve(456);
      setTimeout(() => {
        assert(promise.state === "fulfilled");
        assert(onFulfilled.calledWith(123));
        assert(onFulfilled.calledOnce);
        done();
      }, 0);
    });
    promise.then(onFulfilled);
  });
});
