let Firebase = require('firebase');
let range = require('lodash/range');

let ref = new Firebase('https://mtgbot.firebaseio.com');
let cards = ref.child('cards');
let histories = ref.child('histories');
let maxCardId = 23231;

async function cardDataDump(name, filter) {
  let count = 0;
  let result = await Promise.all(
    range(1, maxCardId).map(async (idx) => {
      try {
        let key = '' + idx;
        let snapshots = await Promise.all([cards, histories].map(aRef => {
          return aRef.child(key).once('value');
        }));

        let [card, history] = await Promise.all(snapshots.map(snapshot => {
          return snapshot.val();
        }));

        let pass = filter(card, history);
        if (pass) {
          count += 1;
          console.log('Count = ', count);
        }

        console.log('Processed', idx);
        return pass ? card : null;
      } catch (error) {
        return null;
        console.log(error.toString());
      }
    })
  );

  console.log('Export to Firebase!');

  let dump = ref.child('dumps').child(name);
  await Promise.all(
    result.map(card => {
      if (card == null) {
        return Promise.resolve();
      }

      return dump.child(card.mwpId).set(card);
    })
  );

  console.log('Done');
}

module.exports = cardDataDump;
