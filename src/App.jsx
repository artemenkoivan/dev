import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import ProtectedRoute from './helpers/routeGuard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './views/Home/Home'
import Login from './views/Login/Login'

// Admin views
import Admin from './views/Admin/Admin'
import NewTag from './views/Admin/NewTag'
import NewQuestion from './views/NewQuestion/NewQuestion'
import QuestionPage from './views/QuestionPage/QuestionPage'
import Profile from './views/Profile/Profile'
import UserSettings from './views/UserSettings/UserSettings'

class App extends Component {
  render() {
    const { authenticated, accessLevel } = this.props
    return (
      <Router>
        <div id="app">
          <Switch>
            <Route path="/" exact component={ Home } />
            <ProtectedRoute path="/admin" exact component={ Admin } canAccess={ !!accessLevel } redirect="/" />
            <ProtectedRoute path="/admin/tag/new" component={ NewTag } canAccess={ !!accessLevel } redirect="/" />
            <ProtectedRoute path="/login" component={ Login } canAccess={ !authenticated } redirect="/" />
            <ProtectedRoute exact path="/question/new" component={ NewQuestion } canAccess={ authenticated } redirect="/" />
            <Route path="/question/:id" exact component={ QuestionPage } redirect="/question/"/>
            <ProtectedRoute exact path="/settings" component={UserSettings} redirect="/" canAccess={ authenticated } />
            <Route path="/user/:name" exact component={Profile} />
          </Switch>
        </div>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.get('authenticated'),
    accessLevel: state.user.get('accessLevel')
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

App.propTypes = {
  authenticated: propTypes.bool.isRequired,
  accessLevel: propTypes.any
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
