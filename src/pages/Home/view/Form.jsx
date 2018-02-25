import React from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

class HomeForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
      this.props.onSubmit(values)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout='inline' onSubmit={this.handleOnSubmit}>
        <FormItem label='Username'>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Username is required!' }],
          })(<Input />)}
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </FormItem>
      
      </Form>
    )
  }
}

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      username: Form.createFormField({
        ...props.username,
        value: (props.username && props.username.value) || 0,
      }),
    }
  },
  // onValuesChange(_, values) {
  //   console.log(values)
  // },
})(HomeForm)

export default CustomizedForm
