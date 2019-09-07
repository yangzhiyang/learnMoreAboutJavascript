class MyPromise {
  constructor(fn) {
    if(typeof fn !== 'function') {
      throw new Error('Promise只接收函数')
    }
    fn();
  }
  then() {}
}

export default MyPromise;