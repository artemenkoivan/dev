import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import propTypes from 'prop-types'
import { Loading, Form, Input, Radio, Button } from 'element-react'
import { getUser } from '../../actions/admin'
import Header from '../../components/Header'

class EditUser extends Component {
  constructor() {
    super()

    this.state = {
      form: {
        username: '',
        email: '',
        avatar: '',
        description: '',
        accessLevel: ''
      }
    }
  }

  componentDidMount() {
    const { getUser, match } = this.props
    getUser(match.params.name)
  }

  componentWillReceiveProps(nextProps) {
    let level

    if (
      nextProps.user.accessLevel === undefined ||
      nextProps.user.accessLevel == 0
    ) {
      level = 0
    }

    if (nextProps.user.accessLevel === 1) {
      level = 1
    }

    this.setState({
      form: {
        accessLevel: level
      }
    })
  }

  onFormChange = (key, value) => {
    this.setState(state => ({ form: { ...state.form, [key]: value } }))
  }

  onChange = value => {
    this.setState({ form: { accessLevel: value } })
  }

  render() {
    const {
      props: {
        match,
        pending,
        user: { userName, email, avatar, description, accessLevel }
      },
      state: { form },
      onFormChange,
      onChange
    } = this
    const routeUserName = match.params.name

    return (
      <DocumentTitle title={`GeekAsks –– Пользователь ${routeUserName}`}>
        <div id="editUserPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h3 className="page-title">
                  <Link to="/admin">Администрирование сайтом</Link> /
                  Пользователь {routeUserName}
                </h3>
              </div>

              <div className="col-xs-12">
                {pending ? (
                  <Loading fullscreen={true} text="Загружаем..." />
                ) : (
                  <Form className="editUser-form">
                    <Form.Item>
                      <Input defaultValue={userName} placeholder="Имя" />
                    </Form.Item>

                    <Form.Item>
                      <Input defaultValue={email} placeholder="E-mail" />
                    </Form.Item>

                    <Form.Item>
                      <Input
                        defaultValue={description}
                        type="textarea"
                        placeholder="О себе"
                      />
                    </Form.Item>

                    <Form.Item>
                      <div className="editUser-form__radio">
                        <Radio
                          value="0"
                          checked={form.accessLevel === 0}
                          onChange={this.onChange}
                        >
                          Пользователь
                        </Radio>
                        <Radio
                          value="1"
                          checked={form.accessLevel === 1}
                          onChange={this.onChange}
                        >
                          Администратор
                        </Radio>
                      </div>
                    </Form.Item>

                    <Button nativeType="submit">Сохранить</Button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.admin.get('user'),
    pending: state.admin.get('pending')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUser(name) {
      dispatch(getUser(name))
    }
  }
}

EditUser.propTypes = {
  getUser: propTypes.func,
  user: propTypes.object,
  pending: propTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
