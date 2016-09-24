let stream = require('stream');

class ArrayStream extends stream.Readable {
  constructor(buffer) {
    super({objectMode: true});
    this._buffer = buffer;
  }

  _read() {
    return this.push(this._buffer.length ? this._buffer.pop() : null);
  }
}

module.exports = ArrayStream;
