import React from 'react'
import { DatePicker } from 'antd'
import './index.less'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <DatePicker />
        <h1 className='title'>It Works!</h1>
        <p>Enjoy!</p>
      </div>
    )
  }
}
