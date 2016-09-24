let fetch = require('node-fetch');
let stream = require('stream');

let baseUrl = 'http://api.mtgowikiprice.com';
let maxCardId = 23230;

class ListPriceHistories extends stream.Readable {
  constructor() {
    super({objectMode: true});
    this._idx = 0;
  }

  async _read() {
    if (this._idx > maxCardId) {
      return this.push(null);
    }

    this._idx += 1;
    let url = getCardUrl(this._idx);
    console.log('read', this._idx);
    let res = await fetch(url);
    let json = await res.json();
    this.push({key: '' + this._idx, value: json});
  }
}

function getCardUrl(cardId) {
  return `${baseUrl}/cards/${cardId}/card_histories/chart?foil=false`;
}

module.exports = ListPriceHistories;
