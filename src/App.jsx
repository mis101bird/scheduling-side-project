import React from 'react'
import { Provider } from 'react-redux'
import { DatePicker } from 'antd'
import 'index.less'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <DatePicker />
          <h1 className='title'>It Works!</h1>
          <p>Enjoy!</p>
        </div>
      </Provider>
    )
  }
}
