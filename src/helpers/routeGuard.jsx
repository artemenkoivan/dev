import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'

class RouteGuard extends Component {

  render() {
    let { canAccess, component, redirect, path, name, exact, strict } = this.props
    let routeProps = { path, component, name, exact, strict }

    return canAccess ? <Route { ...routeProps } /> : <Redirect to={ redirect } />
  }
}

RouteGuard.propTypes = {
  canAccess: propTypes.bool,
  component: propTypes.func,
  path: propTypes.string,
  name: propTypes.string,
  exact: propTypes.bool,
  strict: propTypes.bool
}

export default withRouter(RouteGuard)