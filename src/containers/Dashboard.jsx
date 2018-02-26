import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <Card>
          <p>Dashboard</p>
        </Card>
      </div>
    )
  }
}

export default connect()(Dashboard)
