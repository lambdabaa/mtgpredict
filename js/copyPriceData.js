require('babel-polyfill');

let ListPriceHistories = require('./ListPriceHistories');
let SavePriceHistory = require('./SavePriceHistory');

function main() {
  let source = new ListPriceHistories();
  let sink = new SavePriceHistory();
  source.pipe(sink);
}

if (require.main === module) {
  main();
}
