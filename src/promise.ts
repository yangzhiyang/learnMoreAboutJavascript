class MyPromise {
  constructor(fn) {
    if(typeof fn !== 'function') {
      throw new Error('Promise只接收函数')
    }
  }
  then() {}
}

export default MyPromise;