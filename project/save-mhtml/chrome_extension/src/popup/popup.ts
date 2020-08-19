import { crawlAllAction, crawlOnceAction } from './crawl-action'
import { curationAction, optionPanel } from './curation-action'
import { extractAction } from './extract-action'

optionPanel(document.getElementById("curation-card")!)

window.onload = () => {
  const saveButton: HTMLElement = document.getElementById("save")!
  const saveNowButton: HTMLElement = document.getElementById("saveNow")!
  crawlAllAction(saveButton)
  crawlOnceAction(saveNowButton)

  const curationButton: HTMLElement = document.getElementById("curation-card")!
  curationAction(curationButton)

  const extractButton: HTMLElement = document.getElementById("extractor-card")!
  extractAction(extractButton)
}