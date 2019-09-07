class MyPromise {
  succeed = null;
  fail = null;
  constructor(fn) {
    if(typeof fn !== 'function') {
      throw new Error('Promise只接收函数')
    }
    fn(() => {
      setTimeout(() => this.succeed(), 0);
    }, () => {
      setTimeout(() => this.fail(), 0);
    });
  }
  then(succeed, fail) {
    this.succeed = succeed;
    this.fail = fail
  }
}

export default MyPromise;