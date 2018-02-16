import React from 'react'
import { DatePicker } from 'antd'
import 'index.less'
import logo from 'assets/hbfs-logo-01.png'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <img alt='logo' width='50px' src={logo} />
        <DatePicker />
        <h1 className='title'>It Works!</h1>
        <p>Enjoy!</p>
      </div>
    )
  }
}
