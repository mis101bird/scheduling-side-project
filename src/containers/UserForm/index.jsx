import React from 'react'
import { connect } from 'react-redux'
import AdminLayout from '../../components/AdminLayout'
import SectionHeader from '../../components/SectionHeader'
import SectionHeaderTemplate from '../../components/SectionHeaderTemplate'
import SectionContent from '../../components/SectionContent'
import Form from './Form'
import { changeFormFields } from '../../actions/userForm'

class UserForm extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    // this.props.handleFormOnFieldsChange({})
  }

  render() {
    const actionTitle = this.props.type === 'create' ? 'Create' : 'Edit'
    return (
      <div>
        <AdminLayout>
          <SectionHeader>
            <SectionHeaderTemplate
              breadcrumbDataSource={[{ href: '/admin', title: 'Home' }, { href: '/admin/users', title: 'Users' }, { title: actionTitle }]}
              title={`${actionTitle} User`}
            />
          </SectionHeader>
          <SectionContent>
            <Form
              onSubmit={this.props.handleFormOnSubmit}
              onFieldsChange={this.props.handleFormOnFieldsChange}
              formFieldValues={this.props.formFieldValues}
              isLoading={this.props.isLoading}
            />
          </SectionContent>
        </AdminLayout>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
  } = state.userForm
  return {
    formFieldValues,
  }
}

const mapDispatchToProps = dispatch => ({
  // handleFormOnSubmit: formValues => dispatch(sendLoginRequest(formValues)),
  handleFormOnFieldsChange: formFieldsChange => dispatch(changeFormFields(formFieldsChange)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserForm)
