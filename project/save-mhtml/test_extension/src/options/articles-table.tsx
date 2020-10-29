import * as React from 'react'
import { useTable, Column } from 'react-table'
import 'chrome-extension-async'
import { postArticle } from '../background/server'

export interface Article {
  id: number,
  url: string
}

interface Props {
  articles: Article[]
}

export const ArticlesTable: React.FunctionComponent<Props> = ({ articles }) => {
  const data = React.useMemo<Article[]>(() => [...articles], [articles])
  const columns = React.useMemo<Column<Article>[]>(
    () => [
      {
        Header: 'Page ID',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'URL',
        accessor: 'url',
      },
    ], [])
  const instance = useTable({ columns, data })
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance
  const handleClick = async (ev: React.SyntheticEvent) => {
    ev.preventDefault()
    console.log(ev.currentTarget)
    const pageId = ev.currentTarget.children[0].textContent!
    const pageUrl = ev.currentTarget.children[1].textContent!

    chrome.tabs.create({ url: pageUrl }, tab => {
      if (chrome.runtime.lastError) {
        console.error("Wrong in create tab", tab.id)
      }
      console.assert(!!tab.id, "Something wrong on creating new tab")
      const tabId = tab.id!
      chrome.webNavigation.onCompleted.addListener(async details => {
        if (chrome.runtime.lastError) {
          console.error("Wrong in waiting webNavgation on ", tabId)
        }
        const frameId = details.frameId
        if (frameId === 0) {
          const response: any = await chrome.tabs.sendMessage(tabId, { request: "crawl" })
          const mhtml = await chrome.pageCapture.saveAsMHTML({ tabId: tabId })
          const data = {
            article_id: pageId,
            node: response.node,
            stored: true,
            timestamp: new Date().toISOString(),
            mhtml: mhtml
          }
          await postArticle(data)
        }
      })
    })
  }
  return <table {...getTableProps()}>
    <thead>
      {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
              headerGroup.headers.map(column => (
                // Apply the header cell props
                <th {...column.getHeaderProps()}>
                  {// Render the header
                    column.render('Header')}
                </th>
              ))}
          </tr>
        ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row)
          return (
            // Apply the row props
            <tr onClick={handleClick} {...row.getRowProps()}>
              {// Loop over the rows cells
                row.cells.map(cell => {
                  // Apply the cell props
                  return (
                    <td {...cell.getCellProps()}>
                      <a href="#">{// Render the cell contents
                        cell.render('Cell')}</a>
                    </td>
                  )
                })}
            </tr>
          )
        })}
    </tbody>
  </table>
}
