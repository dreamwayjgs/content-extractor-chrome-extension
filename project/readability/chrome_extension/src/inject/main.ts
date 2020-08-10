import { timestampedLog } from '../debug-utils/logger'
import { timeStamp, timeLog } from 'console';
var { Readability } = require('@mozilla/readability');

function main() {
  timestampedLog("inject starts")
  extract()
}

function extract() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse()
  console.log(article)
}

window.onload = function () {
  timestampedLog("Onload")
  setTimeout(() => {
    timestampedLog("Run extract")
    main()
  }, 2000);
}