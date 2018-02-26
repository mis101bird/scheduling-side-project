import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'

class Profile extends React.Component {
  render() {
    return (
      <div>
        <Card>
          <p>Profile</p>
        </Card>
      </div>
    )
  }
}

export default connect()(Profile)
