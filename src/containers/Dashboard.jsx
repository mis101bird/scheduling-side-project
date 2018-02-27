import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'
import AdminLayout from '../components/AdminLayout'

class Dashboard extends React.Component {
  render() {
    return (
      <AdminLayout>
        <Card>
          <p>Dashboard</p>
        </Card>
      </AdminLayout>
    )
  }
}

export default connect()(Dashboard)
