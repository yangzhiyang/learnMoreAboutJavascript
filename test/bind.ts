import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import bind from "../src/bind";

chai.use(sinonChai);
const assert = chai.assert;
(Function.prototype as any).myBind = bind;
assert((Function.prototype as any).myBind !== undefined);

describe("bind", () => {
  it("可以绑定this", () => {
    const fn = function() {
      return this;
    };
    // @ts-ignore
    const newFn = fn.myBind({ name: "myBind" });
    assert(newFn().name === "myBind");
  });
  it("可以传参", () => {
    const fn = function(a1, a2) {
      return [a1, a2];
    };
    // @ts-ignore
    const newFn = fn.myBind({ name: "myBind" }, 123, 456);
    assert(newFn()[0] === 123);
    assert(newFn()[1] === 456);
  });
});
