import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/Header'

// Pages
import Home from '../Home'
import Login from '../Login'
import Admin from '../Admin'
import NotFound from '../NotFound'
import PrivateRoute from '../../components/PrivateRoute'

import './index.less'

const { Content, Footer } = Layout

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header />
          <Content>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <PrivateRoute path='/admin' component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            React Starter 2018
          </Footer>
        </Layout>
      </BrowserRouter>
    )
  }
}
