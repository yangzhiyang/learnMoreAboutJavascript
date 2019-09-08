class MyPromise {
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    nextTick(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[0] === "function") {
          let x;
          try {
            x = handler[0].call(undefined, result);
          } catch (error) {
            return handler[2].reject(error);
          }
          handler[2].resolveWith(x);
        }
      });
    });
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    nextTick(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[1] === "function") {
          let x;
          try {
            x = handler[1].call(undefined, reason);
          } catch (error) {
            return handler[2].reject(error);
          }
          handler[2].resolveWith(x);
        }
      });
    });
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
    } else {
      handler[0] = value => value;
    }
    if (typeof onRejected === "function") {
      handler[1] = onRejected;
    } else {
      handler[1] = e => {
        throw e;
      };
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

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });
    counter += 1;
    textNode.data = String(counter);
  }
}
