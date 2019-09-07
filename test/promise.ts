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
  it("promise.then(success) 中的 success 会在 reslove 被调用的时候执行", done => {
    const success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(success);
  });
  it("promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行", done => {
    const fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject();
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(null, fail);
  });
});
