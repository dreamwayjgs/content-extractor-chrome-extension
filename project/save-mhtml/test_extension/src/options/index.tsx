import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'chrome-extension-async'
import { Article, ArticlesTable } from './articles-table'

interface OptionState {
  testMode: boolean
  articles: Article[]
}

class OptionPage extends React.Component<{}, OptionState> {
  state = {
    testMode: false,
    articles: []
  }
  startTest = async () => {
    //request Test to Chrome        
    const body: any = await chrome.runtime.sendMessage({
      request: "urls",
      testMode: true
    })
    const { articles } = body
    chrome.storage.sync.set({
      test: true,
      articles: articles
    }, () => {
      this.setState({
        testMode: true,
        articles: articles
      })
    })
  }
  render() {
    return <div>
      <h1>
        Framework Options
      </h1>
      <button onClick={this.startTest}>Run Test Suite</button>
      <h3>
        Target pages / TEST: {this.state.testMode.toString()}
      </h3>
      <ArticlesTable articles={this.state.articles}></ArticlesTable>
    </div>
  }
}

ReactDOM.render(<OptionPage></OptionPage>, document.getElementById("app"))