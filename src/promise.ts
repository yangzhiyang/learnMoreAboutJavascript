class MyPromise {
  onFulfilled = null;
  onRejected = null;
  state = "pending";
  resolve(result) {
    setTimeout(() => {
      if (typeof this.onFulfilled === "function") {
        this.state = "fulfilled";
        this.onFulfilled(result);
      }
    }, 0);
  }
  reject(reason) {
    setTimeout(() => {
      if (typeof this.onRejected === "function") {
        this.onRejected(reason);
      }
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("Promise只接收函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    if (typeof onFulfilled === "function") {
      this.onFulfilled = onFulfilled;
    }
    if (typeof onRejected === "function") {
      this.onRejected = onRejected;
    }
  }
}

export default MyPromise;
