let fetch = require('node-fetch');
let stream = require('stream');

let baseUrl = 'https://www.mtgowikiprice.com';

class ListMagicSetCards extends stream.Transform {
  constructor() {
    super({objectMode: true});
  }

  async _transform(set, encoding, callback) {
    try {
      let cards = await findCardsBySet(set);
      return callback(null, cards);
    } catch (error) {
      return callback(error);
    }
  }
}

async function findCardsBySet(set, result = [], idx = 1) {
  let url = `${baseUrl}/card/${set}/${idx}`;
  let res = await fetch(url);
  if (res.status !== 200) {
    console.log(`Not found: ${set}#${idx}`);
    return result;
  }

  let text = await res.text();
  let nameMatch = /\<title\>([^|]+)/.exec(text);
  let idMatch = /\/cards\/(\d+)\/card_histories\/chart/.exec(text);
  let name = nameMatch[1]
    .trim()
    .replace('&#39;', '\'');
  let mwpId = +idMatch[1];
  let card = {set, name, mwpId, url};
  console.log(`Found: ${JSON.stringify(card)}`);
  result.push(card);
  return findCardsBySet(set, result, idx + 1);
}

module.exports = ListMagicSetCards;
