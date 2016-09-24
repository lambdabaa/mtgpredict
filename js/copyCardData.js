require('babel-polyfill');

let ListMagicSetCards = require('./ListMagicSetCards');
let SaveCardData = require('./SaveCardData');
let listMagicSets = require('./listMagicSets');

function main() {
  let source = listMagicSets();
  let sink = new SaveCardData();
  source
    .pipe(new ListMagicSetCards())
    .pipe(sink);
}

if (require.main === module) {
  main();
}
