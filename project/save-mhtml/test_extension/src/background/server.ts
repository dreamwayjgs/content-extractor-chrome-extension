const endpoint = "http://127.0.0.1:53000"

export async function postArticle(data: any) {
  const formData = new FormData()
  for (const [key, value] of Object.entries<any>(data)) {
    if (typeof (value) === 'string' || value instanceof Blob) {
      formData.append(key, value)
    }
    else {
      formData.append(key, value.toString())
    }
  }
  const url = new URL('article', endpoint)
  fetch(url.toString(), {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("OK", res)
  }).catch(reason => {
    console.error(reason)
  })
}