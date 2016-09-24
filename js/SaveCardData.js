let Firebase = require('firebase');
let stream = require('stream');

let ref = new Firebase('https://mtgbot.firebaseio.com/cards');

class SaveCardData extends stream.Writable {
  constructor() {
    super({objectMode: true});
  }

  async _write(cards, encoding, callback) {
    try {
      console.log('Save cards', cards[0].set);
      await saveCards(cards);
      console.log(cards[0].set, 'OK');
      return callback();
    } catch (error) {
      console.error(error.toString());
      callback(error);
    }
  }
}

function saveCards(cards) {
  return Promise.all(cards.map(card => {
    let child = ref.child(card.mwpId);
    return child.set(card);
  }));
}

module.exports = SaveCardData;
