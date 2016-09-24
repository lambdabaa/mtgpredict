require('babel-polyfill');

let cardDataDump = require('./cardDataDump');
let colors = require('colors');

function main() {
  cardDataDump('highvalue', (card, history) => {
    let buy = history['1'].data;
    for (let key in buy) {
      let value = buy[key];
      if (value['1'] >= 1) {
        console.log(`${card.name}... PASS.`.green);
        return true;
      }
    }

    console.log(`${card.name}... FAIL.`.yellow);
    return false;
  });
}

if (require.main === module) {
  main();
}
