import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'chrome-extension-async'
import { ArticlesTable } from './articles-table'
import { ArticleView } from '../entities/Article'

interface OptionState {
  testMode: boolean
  articles: ArticleView[]
}

interface ArticleCommand {
  mode: string
  targets: string | number[]
}

class OptionPage extends React.Component<{}, OptionState> {
  state = {
    testMode: false,
    articles: []
  }
  componentDidMount() {
    chrome.storage.sync.get(({ articles }) => {
      this.setState({
        articles: articles
      })
    })
  }
  getArticleViewSet = async (option: { testMode: boolean, name: string }, ev: React.SyntheticEvent) => {
    ev.preventDefault()
    const { name, testMode } = option
    console.log("REQUEST ARTICLES on testmode", testMode)
    const body: any = await chrome.runtime.sendMessage({ command: "view", resource: "url", testMode: testMode })
    console.log(body)
    const { articles } = body
    chrome.storage.sync.set({
      articles: articles
    }, () => {
      this.setState({
        articles: articles
      })
    })
  }
  run = async (command: ArticleCommand, ev: React.SyntheticEvent) => {
    ev.preventDefault()
    const { mode, targets } = command
    if (targets !== 'all') return
    chrome.storage.sync.get(({ articles }) => {
      console.log(articles)
      chrome.runtime.sendMessage({ command: mode, body: articles })
    })
  }
  render() {
    return <div>
      <h1 className="title">
        Framework Options
      </h1>
      <h3 className="subtitme">
        Dataset Selection
      </h3>
      <div className="field has-addons buttons are-medium">
        <button className="button is-primary" onClick={this.getArticleViewSet.bind(this, { testMode: false, name: 'all' })}>ALL</button>
        <button className="button is-danger" onClick={this.getArticleViewSet.bind(this, { testMode: true, name: 'all' })}>TEST</button>
        <button className="button" onClick={this.getArticleViewSet.bind(this, { testMode: false, name: 'naver' })}>Naver</button>
        <button className="button" onClick={this.getArticleViewSet.bind(this, { testMode: false, name: 'alexa' })}>Alexa 50</button>
      </div>
      <h3 className="subtitle">
        Target pages / TEST: {this.state.testMode.toString()}
      </h3>
      <div className="buttons are-small">
        <button className="button" onClick={this.run.bind(this, {
          mode: 'crawl', targets: 'all'
        })}>Crawl ALL</button>
        <button className="button" onClick={this.run.bind(this, {
          mode: 'curation', targets: 'all'
        })}>Curation ALL (AUTO)</button>
        <button className="button" onClick={this.run.bind(this, {
          mode: 'extract', targets: 'all'
        })}>Extract ALL</button>
        <button className="button" onClick={this.run.bind(this, {
          mode: 'evaluate', targets: 'all'
        })}>Evaluate ALL</button>
      </div>
      <ArticlesTable articles={this.state.articles}></ArticlesTable>
    </div>
  }
}

ReactDOM.render(<OptionPage></OptionPage>, document.getElementById("app"))