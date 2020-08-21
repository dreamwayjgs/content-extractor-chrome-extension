class Extractor {
  constructor() { }
  static runOnce() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0]
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          command: "extract"
        }, (response) => {
          console.log(response)
        })
      }
      else console.log("No TAB TO extract")
    })
  }
}

export default Extractor