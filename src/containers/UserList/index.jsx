import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import SectionHeader from '../../components/SectionHeader'
import SectionHeaderTemplate from '../../components/SectionHeaderTemplate'
import SectionContent from '../../components/SectionContent'
import { CreateButton } from '../../components/AppButton'
import Table from './Table'

class UserList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleTableOnDelete = this.handleTableOnDelete.bind(this)
    this.handleCreateButtonOnClick = this.handleCreateButtonOnClick.bind(this)
  }

  handleCreateButtonOnClick(e) {
    e.preventDefault()
    this.props.history.push('/admin/users/create')
  }

  handleTableOnDelete(record) {
    console.log('handleTableOnDelete', record)
  }

  render() {
    return (
      <div>
        <AdminLayout>
          <SectionHeader>
            <SectionHeaderTemplate
              breadcrumbDataSource={[{ href: '/admin', title: 'Home' }, { title: 'Users' }]}
              title='Users'
            />
          </SectionHeader>
          <SectionContent>
            <CreateButton onClick={this.handleCreateButtonOnClick} />
            <Table onDelete={this.handleTableOnDelete} />
          </SectionContent>
        </AdminLayout>
      </div>
    )
  }
}

export default withRouter(connect()(UserList))
