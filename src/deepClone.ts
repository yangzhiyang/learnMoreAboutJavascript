function deepClone(source) {
  if (source instanceof Object) {
    let dist;
    if (source instanceof Array) {
      dist = new Array();
    } else if (source instanceof Function) {
      dist = function() {
        return source.apply(this, arguments);
      };
    } else {
      dist = new Object();
    }
    for (let key in source) {
      dist[key] = deepClone(source[key]);
    }
    return dist;
  }
  return source;
}

export default deepClone;
