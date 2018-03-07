import React from 'react'
import { Divider, Card, TreeSelect } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Base64 } from 'js-base64'
import mermaid from 'mermaid'

class Preview extends React.Component {
  constructor (props) {
    super(props)
    this.onDownloadSVG = this.onDownloadSVG.bind(this)
  }

  onDownloadSVG (event) {
    event.target.href = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`
    event.target.download = `mermaid-diagram-${moment().format('YYYYMMDDHHmmss')}.svg`
  }

  render () {
    const { code, match: { url }, location: { search } } = this.props

    const TreeNode = TreeSelect.TreeNode;

    return <div>
      <Card title='Preview'>
        <div ref={div => { this.container = div }}>{code}</div>
      </Card>
      <Card title="Graph">
        <TreeSelect
          showSearch
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
        >
          <TreeNode disabled={true} value="parent 1" title="in a conservation area?" key="0-1">
            <TreeNode value="in a conservation area? / yes" title="yes" key="random" />
            <TreeNode value="in a conservation area? / no" title="no" key="random1">
              <TreeNode value="no2" title="Does the principal elevation of the?" key="random8" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      </Card>
      <Card title='Actions'>
        <div className='links'>
          <Link to={url.replace('/edit/', '/view/') + search}>Link to View</Link>
          <Divider type='vertical' />
          <a href='' download='' onClick={this.onDownloadSVG}>Download SVG</a>
        </div>
      </Card>
    </div>
  }

  initMermaid () {
    const { code, history, match: { url } } = this.props
    try {
      mermaid.parse(code)
      mermaid.init(undefined, this.container)
    } catch ({str, hash}) {
      const base64 = Base64.encodeURI(str)
      history.push(`${url}/error/${base64}`)
    }
  }

  componentDidMount () {
    this.initMermaid()
  }

  componentDidUpdate () {
    this.container.removeAttribute('data-processed')
    this.container.innerHTML = this.props.code
    this.initMermaid()
  }
}

export default Preview
