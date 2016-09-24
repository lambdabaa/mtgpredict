let Firebase = require('firebase');
let stream = require('stream');

let ref = new Firebase('https://mtgbot.firebaseio.com/histories');

class SavePriceHistory extends stream.Writable {
  constructor() {
    super({objectMode: true});
  }

  async _write(chunk, encoding, callback) {
    try {
      await this._writeObject(chunk);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  _writeObject(object) {
    let {key, value} = object;
    console.log('write', key);
    return ref.child(key).set(value);
  }
}

module.exports = SavePriceHistory;
