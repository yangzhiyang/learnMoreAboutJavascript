class MyPromise {
  STATE_FULFILLED = "fulfilled";
  STATE_REJECTED = "rejected";
  STATE_PENDING = "pending";

  state = this.STATE_PENDING;

  callbacks = [];

  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("Promise只接收函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  private resolveOrReject(state, data) {
    if (this.state !== this.STATE_PENDING) return;
    this.state = state;
    const i = [this.STATE_FULFILLED, this.STATE_REJECTED].indexOf(state);
    nextTick(() => {
      this.callbacks.forEach(handler => {
        if (typeof handler[i] === "function") {
          let x;
          try {
            x = handler[i].call(undefined, data);
          } catch (error) {
            return handler[2].reject(error);
          }
          handler[2].resolveWith(x);
        }
      });
    });
  }

  resolve(result) {
    this.resolveOrReject(this.STATE_FULFILLED, result);
  }

  reject(reason) {
    this.resolveOrReject(this.STATE_REJECTED, reason);
  }

  then(onFulfilled?, onRejected?) {
    const handler = [];
    typeof onFulfilled === "function"
      ? (handler[0] = onFulfilled)
      : (handler[0] = value => value);

    typeof onRejected === "function"
      ? (handler[1] = onRejected)
      : (handler[1] = e => {
          throw e;
        });

    handler[2] = new MyPromise(() => {});
    this.callbacks.push(handler);

    return handler[2];
  }

  resolveWithSelf() {
    this.reject(new TypeError());
  }

  resolveWithPromise(x) {
    x.then(
      result => {
        this.resolve(result);
      },
      reason => {
        this.reject(reason);
      }
    );
  }

  resolveWihtThenable(x) {
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
  }

  resolveWithObject(x) {
    const then = this.getThen(x);
    if (then instanceof Function) {
      this.resolveWihtThenable(x);
    } else {
      this.resolve(x);
    }
  }

  private getThen(x) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      this.reject(error);
    }
    return then;
  }

  resolveWith(x) {
    if (this === x) {
      this.resolveWithSelf();
    } else if (x instanceof MyPromise) {
      this.resolveWithPromise(x);
    } else if (x instanceof Object) {
      this.resolveWithObject(x);
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
