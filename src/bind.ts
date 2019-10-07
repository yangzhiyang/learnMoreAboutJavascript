function bind(asThis, ...args1) {
  const fn = this;

  function result(...args2) {
    return fn.call(this instanceof result ? this : asThis, ...args1, ...args2);
  }
  result.prototype = fn.prototype;
  return result;
}

export default bind;
