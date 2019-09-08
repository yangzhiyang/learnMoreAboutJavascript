class MyPromise {
  onFulfilled = null;
  onRejected = null;
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    process.nextTick(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[0] === "function") {
          const x = handler[0].call(undefined, result);
          handler[2].resolveWith(x);
        }
      });
    }, 0);
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    process.nextTick(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[1] === "function") {
          const x = handler[1].call(undefined, reason);
          handler[2].resolveWith(x);
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
    handler[2] = new MyPromise(() => {});
    this.callbacks.push(handler);
    return handler[2];
  }
  resolveWith(x) {
    if (this === x) {
      this.reject(new TypeError());
    } else if (x instanceof MyPromise) {
      x.then(
        result => {
          this.resolve(result);
        },
        reason => {
          this.reject(reason);
        }
      );
    } else if (x instanceof Object) {
      let then;
      try {
        then = x.then;
      } catch (error) {
        this.reject(error);
      }
      if (then instanceof Function) {
        try {
          x.then(
            y => {
              this.resolveWith(y);
            },
            r => {
              this.reject(r);
            }
          );
        } catch (error) {
          this.reject(error);
        }
      } else {
        this.resolve(x);
      }
    } else {
      this.resolve(x);
    }
  }
}

export default MyPromise;
