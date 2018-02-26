import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'

class Home extends React.Component {
  render() {
    return (
      <div className='admin-page'>
        <Card>
          <p>Home</p>
        </Card>
      </div>
    )
  }
}

export default connect()(Home)
