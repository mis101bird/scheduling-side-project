import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { increment, decrement } from './actions'

class Home extends React.Component {
  static propTypes = {
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div>
        <Input />
        <p>Home</p>
        <div>
          <button onClick={this.props.onIncrement}>+</button>
          <button onClick={this.props.onDecrement}>-</button>
          <span>Count: {this.props.value}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { value } = state.home
  return {
    value: value || 0,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrement: () => dispatch(increment()),
    onDecrement: () => dispatch(decrement()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
