class Eventhub {
  cache: { [key: string]: Array<(data: unknown) => void> } = {};
  on(eventName: string, fn: (data?: unknown) => void) {
    if (this.cache[eventName] === undefined) {
      this.cache[eventName] = [];
    }
    this.cache[eventName].push(fn);
  }
  emit(eventName: string, data?: unknown) {
    if (this.cache[eventName] === undefined) {
      this.cache[eventName] = [];
    }
    this.cache[eventName].forEach(fn => {
      fn(data);
    });
  }
  off(eventName: string, fn: (data?: unknown) => void) {
    if (this.cache[eventName] === undefined) {
      this.cache[eventName] = [];
    }
    let index = undefined;
    for (let i = 0; i < this.cache[eventName].length; i++) {
      if (this.cache[eventName][i] === fn) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      return;
    } else {
      this.cache[eventName].splice(index, 1);
    }
  }
}

export default Eventhub;
