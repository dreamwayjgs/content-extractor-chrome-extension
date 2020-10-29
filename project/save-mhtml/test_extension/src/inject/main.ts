import Webpage from './webpage'

console.log("Inject started")

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   const request = message.request
//   console.log(sender)
//   switch (request) {
//     case "crawl":
//       const webpage = new Webpage(document)
//       webpage.indexing()
//       sendResponse({ node: webpage })
//       break
//   }
// })

window.onload = () => {
  console.log("Page is fully loaded")
  chrome.runtime.sendMessage({ status: "load" })
}
