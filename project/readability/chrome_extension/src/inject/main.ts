import { timestampedLog } from '../debug-utils/logger'
const Readability = require("./extractors/readability")

function main() {
  timestampedLog("inject starts")
}

function extract() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse()
  console.log(article)
}

main()