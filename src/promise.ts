class MyPromise {
  onFulfilled = null;
  onRejected = null;
  resolve() {
    setTimeout(() => {
      if (typeof this.onFulfilled === "function") {
        this.onFulfilled();
      }
    }, 0);
  }
  reject() {
    setTimeout(() => this.onRejected(), 0);
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
  }
}

export default MyPromise;
