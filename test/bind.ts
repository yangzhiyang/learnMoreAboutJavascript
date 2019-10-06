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
});
