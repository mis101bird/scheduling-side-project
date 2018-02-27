import React from 'react'
import { Layout } from 'antd'
import './index.less'

const { Footer } = Layout

class CustomisedFooter extends React.Component {
  render() {
    return (
      <Footer className='app-footer'>
        by @bichenkk
      </Footer>
    )
  }
}

export default CustomisedFooter
