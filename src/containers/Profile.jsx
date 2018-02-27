import React from 'react'
import { connect } from 'react-redux'
import AdminLayout from '../components/AdminLayout'
import SectionHeader from '../components/SectionHeader'
import SectionContent from '../components/SectionContent'

class Profile extends React.Component {
  render() {
    return (
      <div>
        <AdminLayout>
          <SectionHeader />
          <SectionContent>
            <p>Profile</p>
          </SectionContent>
        </AdminLayout>
      </div>
    )
  }
}

export default connect()(Profile)
