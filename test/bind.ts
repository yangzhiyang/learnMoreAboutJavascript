import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
const bind = require("../src/bind.js");

chai.use(sinonChai);
const assert = chai.assert;
(Function.prototype as any).myBind = bind;

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
    const newFn1 = fn.myBind({ name: "myBind" }, 123, 456);
    assert(newFn1()[0] === 123);
    assert(newFn1()[1] === 456);
    // @ts-ignore
    const newFn2 = fn.myBind({ name: "myBind" });
    assert(newFn2(234, 567)[0] === 234);
    assert(newFn2(234, 567)[1] === 567);
    // @ts-ignore
    const newFn3 = fn.myBind({ name: "myBind" }, 123);
    assert(newFn3(567)[0] === 123);
    assert(newFn3(567)[1] === 567);
  });
  it("支持 new 时绑定参数，且有fn prototype 上的属性", () => {
    const fn = function(a1, a2) {
      this.a1 = a1;
      this.a2 = a2;
    };
    fn.prototype.test = "test";
    // @ts-ignore
    const newFn1 = fn.myBind({ name: "myBind" }, 123, 456);
    const newFn2 = new newFn1();
    assert(newFn2.a1 === 123);
    assert(newFn2.a2 === 456);
    assert(newFn2.test === "test");
  });
});
