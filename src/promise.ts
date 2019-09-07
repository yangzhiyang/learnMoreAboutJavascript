class MyPromise {
  onFulfilled = null;
  onRejected = null;
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[0] === "function") {
          handler[0].call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    setTimeout(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[1] === "function") {
          handler[1].call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("Promise只接收函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    const handler = [];
    if (typeof onFulfilled === "function") {
      handler[0] = onFulfilled;
    }
    if (typeof onRejected === "function") {
      handler[1] = onRejected;
    }
    this.callbacks.push(handler);
  }
}

export default MyPromise;
