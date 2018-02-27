import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'
import AdminLayout from '../components/AdminLayout'

class Profile extends React.Component {
  render() {
    return (
      <div>
        <AdminLayout>
          <Card>
            <p>Profile</p>
          </Card>
        </AdminLayout>
      </div>
    )
  }
}

export default connect()(Profile)
