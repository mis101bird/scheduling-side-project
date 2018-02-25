import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './Header'

// Pages
import { view as Home } from '../../Home'
import { view as Login } from '../../Login'
import { view as Admin } from '../../Admin'
import NotFound from '../../NotFound'
import PrivateRoute from './PrivateRoute'

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
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/admin' component={Admin} />
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
