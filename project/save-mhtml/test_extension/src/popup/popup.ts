window.onload = () => {
  const testAllButton = document.getElementById("testAll")!
  testAllButton.addEventListener('click', (ev) => {
    chrome.runtime.sendMessage({
      test: "all"
    }, (response) => {
      console.log(new Date().toISOString())
      console.log("RESPONSE", response)
    })
  })
}