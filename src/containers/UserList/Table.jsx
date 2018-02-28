import React from 'react'
import { Table, Divider, Modal } from 'antd'
import { TableRowEditButton, TableRowDeleteButton } from '../../components/AppButton'

const data = [{
  id: '1',
  first_name: 'KK',
  last_name: 'Chen',
  email: 'kk@bichenkk.com',
}]

class UserListTable extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleDeleteButtonOnClick = this.handleDeleteButtonOnClick.bind(this)
  }

  handleDeleteButtonOnClick() {
    const handleTableOnDelete = () => { this.props.onDelete() }
    Modal.confirm({
      title: 'Delete Item',
      content: 'Are you sure to delete this item?',
      onOk() {
        handleTableOnDelete()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  get columns() {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
      }, {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
      }, {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <TableRowEditButton to={`/admin/users/${record.id}/edit`} />
            <Divider type='vertical' />
            <TableRowDeleteButton deleteAction={() => this.props.onDelete(record)} />
          </span>
        ),
      },
    ]
  }

  render() {
    return (
      <Table
        rowKey='id'
        dataSource={data}
        columns={this.columns}
        {...this.props}
      />
    )
  }
}

export default UserListTable
