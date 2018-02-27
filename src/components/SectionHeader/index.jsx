import React from 'react'
import { Breadcrumb, Icon } from 'antd'
import './index.less'

class SectionHeader extends React.Component {
  render() {
    return (
      <div className='section-header'>
        <Breadcrumb>
          <Breadcrumb.Item href='/admin'>
            <Icon type='home' />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Users
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1>Users</h1>
        <p>This is a section header.</p>
      </div>
    )
  }
}

export default SectionHeader
