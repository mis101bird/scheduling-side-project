import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { message } from 'antd'
import AdminLayout from '../../components/AdminLayout'
import SectionHeader from '../../components/SectionHeader'
import SectionHeaderTemplate from '../../components/SectionHeaderTemplate'
import SectionContent from '../../components/SectionContent'
import Spin from '../../components/Spin'
import Form from './Form'
import { editForm, fetchItem, createItem, editItem, reset } from '../../actions/userForm'

const pageTitle = 'User'

class ItemForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
    this.props.reset()
  }

  componentDidMount() {
    // this.props.handleFormOnFieldsChange({})
    if (this.props.type === 'edit') {
      this.props.fetchItem()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCreateItemLoading && nextProps.isCreateItemSuccess) {
      message.success('You have successfully created the item.')
    }
    if (this.props.isEditItemLoading && nextProps.isEditItemSuccess) {
      message.success('You have successfully edited the item.')
    }
  }

  handleFormOnSubmit() {
    if (this.props.type === 'create') {
      this.props.createItem()
    } else {
      this.props.editItem()
    }
  }

  render() {
    const { type, isCreateItemSuccess } = this.props
    const isCreateForm = type === 'create'
    const actionTitle = isCreateForm ? 'Create' : 'Edit'
    if (isCreateItemSuccess) {
      return <Redirect to='/admin/users' />
    }
    return (
      <div>
        <AdminLayout>
          <SectionHeader>
            <SectionHeaderTemplate
              breadcrumbRoutes={[{ path: '/admin', title: 'Home' }, { path: '/admin/users', title: 'Users' }, { title: actionTitle }]}
              title={`${actionTitle} User`}
            />
          </SectionHeader>
          <SectionContent>
            {
              this.props.isFetchItemLoading && <Spin />
            }
            {
              (isCreateForm || (!isCreateForm && this.props.item)) &&
              <Form
                onSubmit={isCreateForm ? this.props.createItem : this.props.editItem}
                onFieldsChange={this.props.editForm}
                formFieldValues={this.props.formFieldValues}
                isLoading={this.props.isCreateItemLoading || this.props.isEditItemLoading}
                type={this.props.type}
              />
            }
          </SectionContent>
        </AdminLayout>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isFetchItemLoading,
    isEditItemLoading,
    isCreateItemLoading,
    isCreateItemSuccess,
    isEditItemSuccess,
    item,
  } = state.userForm
  return {
    isFetchItemLoading,
    formFieldValues,
    isEditItemLoading,
    isCreateItemLoading,
    isCreateItemSuccess,
    isEditItemSuccess,
    item,
  }
}

const mapDispatchToProps = dispatch => ({
  createItem: formValues => dispatch(createItem(formValues)),
  editItem: formValues => dispatch(editItem(formValues)),
  fetchItem: param => dispatch(fetchItem(param)),
  editForm: formFieldsChange => dispatch(editForm(formFieldsChange)),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemForm)
