import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import logo from '../assets/logo-transparent.png'
import { Link } from 'react-router-dom'
import { getProfile } from '../actions/user'
import { Button } from 'element-react'
import NavBar from './NavBar'
import { logout } from '../actions/auth'

class Header extends Component {
  componentDidMount() {
    this.props.getProfile(localStorage.getItem('userName'))
  }

  render() {
    let { authenticated, userName, logout, accessLevel, profile } = this.props

    return (
      <div className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-sm-2 col-xs-2">
              <div className="box box-v-center">
                <Link to="/" className="main-header__logo">
                  <img src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="col-md-10 col-sm-10 col-xs-10">
              <div className="box box-v-center box-h-end">
                {authenticated &&
                  profile.notifications &&
                  logout && (
                    <NavBar
                      userName={userName}
                      notifications={profile.notifications.length}
                      accessLevel={!!accessLevel}
                      logout={logout}
                    />
                  )}
                <Button
                  type="primary"
                  size="small"
                  className="new-question-button"
                >
                  <Link
                    className="button-inner-link"
                    to={authenticated ? '/question/new' : '/login'}
                  >
                    Задать вопрос
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="main-search" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.get('authenticated'),
    userName: state.user.get('userName'),
    email: state.user.get('email'),
    accessLevel: state.user.get('accessLevel'),
    profile: state.user.get('profile')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout() {
      dispatch(logout())
    },
    getProfile(name) {
      dispatch(getProfile(name))
    }
  }
}

Header.propTypes = {
  authenticated: propTypes.bool.isRequired,
  userName: propTypes.string.isRequired,
  email: propTypes.string.isRequired,
  logout: propTypes.func.isRequired,
  accessLevel: propTypes.any
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
