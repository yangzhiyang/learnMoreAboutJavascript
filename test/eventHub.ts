import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import EventHub from "../src/eventHub";

chai.use(sinonChai);

const assert = chai.assert;

describe("eventHub", () => {
  it("是一个对象", () => {
    const eventHub = new EventHub();
    assert.isObject(eventHub);
  });
  it(".on 了之后 .emit，会触发 .on 的函数", () => {
    const eventHub = new EventHub();
    const fn = sinon.fake();
    eventHub.on("test", fn);
    eventHub.emit("test");
    assert(fn.called);
  });
  it(".off指定函数 会将 .on 的对应函数删除", () => {
    const eventHub = new EventHub();
    const fn = sinon.fake();
    eventHub.on("test", fn);
    eventHub.off("test", fn);
    eventHub.emit("test");
    assert.isFalse(fn.called);
  });
});
