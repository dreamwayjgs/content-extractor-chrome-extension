import app from './app'

app.listen(53000, "0.0.0.0")
console.log(new Date().toISOString(), "Koa running on 53000 to all hosts")