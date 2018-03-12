import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import ProtectedRoute from './helpers/routeGuard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './views/Home/Home'
import Login from './views/Login/Login'
import Admin from './views/Admin/Admin'
import NewTag from './views/Admin/NewTag'
import NewQuestion from './views/NewQuestion/NewQuestion'
import QuestionPage from './views/QuestionPage/QuestionPage'
import Profile from './views/Profile/Profile'
import UserSettings from './views/UserSettings/UserSettings'
import EditUser from './views/Admin/EditUser'
import EditTag from './views/Admin/EditTag'
import Tag from './views/Tag/Tag'
import Feed from './views/Feed/Feed'
import Notifications from './views/Notifications/Notifications'

class App extends Component {
  render() {
    const { authenticated, accessLevel } = this.props

    return (
      <Router>
        <div id="app">
          <Switch>
            <Route path="/" exact component={Home} />
            <ProtectedRoute
              path="/admin"
              exact
              component={Admin}
              canAccess={!!accessLevel}
              redirect="/"
            />
            <ProtectedRoute
              path="/admin/tag/new"
              component={NewTag}
              canAccess={!!accessLevel}
              redirect="/"
            />
            <ProtectedRoute
              path="/login"
              component={Login}
              canAccess={!authenticated}
              redirect="/"
            />
            <ProtectedRoute
              exact
              path="/question/new"
              component={NewQuestion}
              canAccess={authenticated}
              redirect="/"
            />
            <ProtectedRoute
              exact
              path="/admin/tag/edit/:name"
              component={EditTag}
              canAccess={!!accessLevel}
              redirect="/"
            />
            <ProtectedRoute
              path="/admin/user/:name"
              component={EditUser}
              canAccess={!!accessLevel}
              redirect="/"
            />
            <Route
              path="/question/:id"
              exact
              component={QuestionPage}
              redirect="/question/"
            />
            <ProtectedRoute
              exact
              path="/settings"
              component={UserSettings}
              redirect="/"
              canAccess={authenticated}
            />
            <ProtectedRoute
              exact
              path="/notifications"
              component={Notifications}
              redirect="/"
              canAccess={authenticated}
            />
            <ProtectedRoute
              exact
              path="/feed"
              component={Feed}
              redirect="/"
              canAccess={authenticated}
            />
            <Route path="/user/:name" exact component={Profile} />
            <Route path="/tag/:name" exact component={Tag} />
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
