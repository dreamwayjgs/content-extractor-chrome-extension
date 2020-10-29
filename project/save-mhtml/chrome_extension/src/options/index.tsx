import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'chrome-extension-async'
import { ArticlesTable } from './articles-table'
import { ArticleView } from '../entities/Article'

interface OptionState {
  testMode: boolean
  articles: ArticleView[]
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
  getArticleView = async (testMode: boolean, ev: React.SyntheticEvent) => {
    ev.preventDefault()
    //request Test to Chrome        
    const body: any = await chrome.runtime.sendMessage({ command: "view", resource: "url", testMode: testMode })
    console.log(body)
    const { articles } = body
    chrome.storage.sync.set({
      articles: articles
    })
    this.setState({
      articles: articles
    })
  }
  crawlArticle = async (targets: string | number[], ev: React.SyntheticEvent) => {
    ev.preventDefault()
    if (targets !== 'all') return
    chrome.storage.sync.get(({ articles }) => {
      console.log(articles)
      // chrome.runtime.sendMessage({ command: "crawl", body: articles })
    })
  }
  render() {
    return <div>
      <h1 className="title">
        Framework Options
      </h1>
      <div className="buttons are-medium">
        <button className="button" onClick={this.getArticleView.bind(this, false)}>View Articles (ALL)</button>
        <button className="button" onClick={this.getArticleView.bind(this, true)}>View Articles (TEST)</button>
      </div>
      <h3 className="subtitle">
        Target pages / TEST: {this.state.testMode.toString()}
      </h3>
      <button className="button" onClick={this.crawlArticle.bind(this, 'all')}>Crawl ALL</button>
      <ArticlesTable articles={this.state.articles}></ArticlesTable>
    </div>
  }
}

ReactDOM.render(<OptionPage></OptionPage>, document.getElementById("app"))