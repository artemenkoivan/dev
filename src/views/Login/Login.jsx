import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import propTypes from 'prop-types'
import Header from '../../components/Header'
import logo from '../../assets/logo-transparent.png'
import { Input, Button, Tabs, Message, Loading } from 'element-react'
import { login, register, clearAuthErrors } from '../../actions/auth'

const emailRegxp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const userNameRegexp = /^[a-z][a-z0-9_]{2,24}$/i

class Login extends Component {
  constructor() {
    super()

    this.state = {}
  }

  handleLogin = e => {
    e.preventDefault()

    let loginData = {
      email: this.refs.loginEmail.refs.input.value,
      password: this.refs.loginPassword.refs.input.value
    }

    if (!loginData.email) {
      return Message.error('Введите адрес электронной почты')
    } else if (!emailRegxp.test(loginData.email)) {
      return Message.warning(
        'Адрес электронной почты введен не верно! example@mail.com'
      )
    }

    if (!loginData.password) {
      return Message.error('Введите пароль')
    } else if (loginData.password.length < 7) {
      return Message.warning('Пароль должен содержать минимум 7 символов')
    }

    this.props.login(loginData)
  }

  handleRegister = e => {
    e.preventDefault()

    let registerData = {
      userName: this.refs.regName.refs.input.value,
      email: this.refs.regEmail.refs.input.value,
      password: this.refs.regPassword.refs.input.value
    }

    if (!registerData.userName) {
      return Message.error('Введите имя пользователя')
    } else if (!userNameRegexp.test(registerData.userName)) {
      return Message.warning(
        'Имя может содержать только a-zA-Z0-9, имя не может начинаться с цифр и должно содержать минимум 3 символа'
      )
    }

    if (!registerData.email) {
      return Message.error('Введите адрес электронной почты')
    } else if (!emailRegxp.test(registerData.email)) {
      return Message.warning(
        'Адрес электронной почты введен не верно! example@mail.com'
      )
    }

    if (!registerData.password) {
      return Message.error('Введите пароль')
    } else if (registerData.password.length < 7) {
      return Message.warning('Пароль должен содержать минимум 7 символов')
    }

    this.props.register(registerData)
  }

  componentDidUpdate(prevProps) {
    if (this.props.serverError.length <= 0) {
      return
    }

    if (prevProps.serverError !== this.props.serverError) {
      Message.error(this.props.serverError)
    }
  }

  render() {
    const { pending } = this.props
    const { handleLogin, handleRegister } = this

    return (
      <DocumentTitle title="GeekAsks | Войти">
        <div id="loginpage">
          <Header />

          <div className="login-form-container">
            <Tabs value="1">
              <Tabs.Pane label="Вход" name="1">
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="login-form__logo">
                    <img src={logo} alt="logo" />
                    <p className="logo-text">GeekAsks</p>
                  </div>
                  <Input placeholder="E-mail" ref="loginEmail" type="email" />
                  <Input
                    placeholder="Пароль"
                    ref="loginPassword"
                    type="password"
                  />

                  {pending ? (
                    <Loading>
                      <Button type="success" nativeType="submit">
                        Войти
                      </Button>
                    </Loading>
                  ) : (
                    <Button type="success" nativeType="submit">
                      Войти
                    </Button>
                  )}
                </form>
              </Tabs.Pane>
              <Tabs.Pane label="Регистрация">
                <form className="register-form" onSubmit={handleRegister}>
                  <div className="register-form__logo">
                    <img src={logo} alt="logo" />
                    <p className="logo-text">GeekAsks</p>
                  </div>
                  <Input placeholder="Имя" type="text" ref="regName" />
                  <Input placeholder="E-mail" type="email" ref="regEmail" />
                  <Input
                    placeholder="Пароль"
                    type="password"
                    ref="regPassword"
                  />

                  {pending ? (
                    <Loading>
                      <Button type="success" nativeType="submit">
                        Зарегестрироваться
                      </Button>
                    </Loading>
                  ) : (
                    <Button type="success" nativeType="submit">
                      Зарегестрироваться
                    </Button>
                  )}
                </form>
              </Tabs.Pane>
            </Tabs>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.get('authenticated'),
    serverError: state.auth.get('serverError'),
    pending: state.auth.get('pending')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: data => {
      dispatch(login(data))
    },
    register: data => {
      dispatch(register(data))
    },
    clearAuthErrors: () => {
      dispatch(clearAuthErrors())
    }
  }
}

Login.propTypes = {
  authenticated: propTypes.bool.isRequired,
  serverError: propTypes.string.isRequired,
  pending: propTypes.bool.isRequired,
  login: propTypes.func.isRequired,
  register: propTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
