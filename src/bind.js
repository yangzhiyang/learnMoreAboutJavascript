function bind(asThis, ...args1) {
  const fn = this;
  return function result(...args2) {
    return fn.call(
      this.__proto__ === result.prototype ? this : asThis,
      ...args1,
      ...args2
    );
  };
}

module.exports = bind;