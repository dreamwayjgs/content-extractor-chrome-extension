const endpoint = "http://127.0.0.1:53000"

console.log("Background started")

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, response) => {
  console.log("Message:", message)
  console.log("From", sender)
  if (message.testMode) {
    getArticlesById([296]).then(body => {
      response({
        articles: body
      })
    })
  }
  else {
    switch (message.request) {
      case "urls":
        getArticles().then(body => {
          response({
            articles: body
          })
        })
        break
    }
  }
  return true
})

export async function establish() {
  const body = await fetch(endpoint).then(res => res.json())
  if (body.status !== "success") {
    throw new Error("Cannot establish connection to server")
  }
  console.log("Connection OK!")
  return true
}

async function getArticlesById(ids: number[]) {
  const url = new URL('article', endpoint)
  ids.forEach(id => {
    url.searchParams.append('id', id.toString())
  })
  const body = await fetch(url.toString()).then(res => res.json())
  return body
}

async function getArticles(from?: number, size?: number) {
  const url = new URL('articles', endpoint)
  const body = await fetch(url.toString()).then(res => res.json())
  return body
}
