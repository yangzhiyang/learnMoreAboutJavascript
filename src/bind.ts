function bind(asThis, ...args) {
  const fn = this;
  return function() {
    return fn.call(asThis, ...args);
  };
}

export default bind;
