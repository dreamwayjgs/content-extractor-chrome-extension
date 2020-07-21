import { timestampedLog } from '../debug-utils/logger'
const Readability = require("./extractors/readability")

function main() {
  timestampedLog("inject starts")
  window.onload = function () {
    timestampedLog("window onload")
    setTimeout(afterLoad, 5000)
  }
}

function afterLoad() {
  timestampedLog("Wait and Run")
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse()
  console.log(article)
}

main()