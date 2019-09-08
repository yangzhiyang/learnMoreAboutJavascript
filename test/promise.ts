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
  it(`onRejected 必须在 promise 完成(rejected)后被调用，
    并把 promise 的 reason 值作为它的第一个参数, 函数在promise完成(rejected)之前绝对不能被调用
    并不能被调用超过一次`, done => {
    const onRejected = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(onRejected.called);
      reject(123);
      reject(456);
      setTimeout(() => {
        assert(promise.state === "rejected");
        assert(onRejected.calledWith(123));
        assert(onRejected.calledOnce);
        done();
      }, 0);
    });
    promise.then(null, onRejected);
  });
  it("在 Promise 代码未执行完之前，不得调用 onFulfilled 和 onRejected", done => {
    const onFulfilled = sinon.fake();
    const onRejected = sinon.fake();
    const promise1 = new Promise(resolve => {
      resolve();
    });
    const promise2 = new Promise((resolve, reject) => {
      reject();
    });
    promise1.then(onFulfilled);
    promise2.then(null, onRejected);
    assert.isFalse(onFulfilled.called);
    assert.isFalse(onRejected.called);
    setTimeout(() => {
      assert.isTrue(onFulfilled.called);
      assert.isTrue(onRejected.called);
      done();
    }, 0);
  });
  it("onFulfilled 和 onRejected 被调用时，不能把 this 带进来", done => {
    const promise = new Promise(resolve => {
      resolve();
    });
    promise.then(function() {
      "use strict";
      assert(this === undefined);
      done();
    });
  });
  it("then 可以在同一个 promise 中调用多次", done => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise(resolve => {
      resolve();
    });
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });
  it("then 可以在同一个 promise 中调用多次", done => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });
  it("then 必须返回一个 promise", () => {
    const promise1 = new Promise(resolve => {
      resolve();
    });
    const promise2 = promise1.then(() => {}, () => {});
    assert(promise2 instanceof Promise);
  });
  it("如果 onFulfilled 或 onRejected 返回一个值x, 运行[[Resolve]](promise2, x)", done => {
    const promise1 = new Promise(resolve => {
      resolve();
    });
    promise1
      .then(() => "success")
      .then(result => {
        assert.equal(result, "success");
        done();
      });
  });
  it("onFulfilled 返回值 x 为 Promise 实例时", done => {
    const promise1 = new Promise(resolve => {
      resolve();
    });
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const promise2 = promise1.then(() => new Promise(resolve => resolve()));
    const promise3 = promise1.then(
      () =>
        new Promise((resolve, reject) => {
          reject();
        })
    );
    promise2.then(fn1);
    promise3.then(null, fn2);
    setTimeout(() => {
      assert(fn1.called);
      assert(fn2.called);
      done();
    });
  });
  it("onRejected 返回值 x 为 Promise 实例时", done => {
    const promise1 = new Promise((resolve, reject) => {
      reject();
    });
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const promise2 = promise1.then(
      null,
      () => new Promise(resolve => resolve())
    );
    const promise3 = promise1.then(
      null,
      () =>
        new Promise((resolve, reject) => {
          reject();
        })
    );
    promise2.then(fn1);
    promise3.then(null, fn2);
    setTimeout(() => {
      assert(fn1.called);
      assert(fn2.called);
      done();
    });
  });
  it("如果 onFulfilled 或 onRejected 抛出一个异常e,promise2 必须被拒绝（rejected）并把e当作原因", done => {
    const error1 = new Error();
    const error2 = new Error();
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();

    const promise1 = new Promise(resolve => {
      resolve();
    });
    const promise2 = new Promise((resolve, reject) => {
      reject();
    });

    const promise3 = promise1.then(() => {
      throw error1;
    });
    const promise4 = promise2.then(null, () => {
      throw error2;
    });

    promise3.then(null, fn1);
    promise4.then(null, fn2);

    setTimeout(() => {
      assert(fn1.called);
      assert(fn2.called);
      assert(fn1.calledWith(error1));
      assert(fn2.calledWith(error2));
      done();
    }, 0);
  });
  it("如果onFulfilled不是一个方法，并且promise1已经完成（fulfilled）, promise2必须使用与promise1相同的值来完成（fulfiled）", done => {
    const promise1 = new Promise(() => "fulfilled");
    const promise2 = promise1.then(null);
    const fn = sinon.fake();
    promise2.then(fn);
    setTimeout(() => {
      assert(fn.called);
      assert(fn.calledWith("fulfilled"));
    }, 0);
  });
});
