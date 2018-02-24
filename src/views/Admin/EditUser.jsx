import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import propTypes from 'prop-types'
import { Loading, Form, Input, Radio, Button, Message } from 'element-react'
import { getUser, editUser } from '../../actions/admin'
import { isEmpty } from 'lodash'
import Header from '../../components/Header'

class EditUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        userName: '',
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

    if (nextProps.successfully) {
      Message.success('Пользователь изменен!')

      setTimeout(() => {
        window.location.reload()
      }, 500)
    }

    if (
      nextProps.user.accessLevel === undefined ||
      nextProps.user.accessLevel == 0
    ) {
      level = 0
    }

    if (nextProps.user.accessLevel == 1) {
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

  onRadioChange = value => {
    this.setState({ form: { accessLevel: value } })
  }

  onFormSubmit = e => {
    e.preventDefault()
    const {
      userName,
      email,
      avatar,
      description,
      accessLevel
    } = this.state.form
    const form = {}

    if (isEmpty(userName)) {
      form.userName = this.props.user.userName
    } else {
      form.userName = userName
    }

    if (isEmpty(email)) {
      form.email = this.props.user.email
    } else {
      form.email = email
    }

    if (isEmpty(description)) {
      form.description = this.props.user.description
    } else {
      form.description = description
    }

    form.accessLevel = accessLevel
    form._id = this.props.user._id

    this.props.editUser(form)
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
      onRadioChange,
      onFormSubmit
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
                  <Form className="editUser-form" onSubmit={onFormSubmit}>
                    <Form.Item>
                      <Input
                        defaultValue={userName}
                        onChange={e => onFormChange('userName', e)}
                        placeholder="Имя"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Input
                        defaultValue={email}
                        onChange={e => onFormChange('email', e)}
                        placeholder="E-mail"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Input
                        defaultValue={description}
                        type="textarea"
                        onChange={e => onFormChange('description', e)}
                        placeholder="О себе"
                      />
                    </Form.Item>

                    <Form.Item>
                      <div className="editUser-form__radio">
                        <Radio
                          value="0"
                          checked={form.accessLevel === 0}
                          onChange={onRadioChange}
                        >
                          Пользователь
                        </Radio>
                        <Radio
                          value="1"
                          checked={form.accessLevel === 1}
                          onChange={onRadioChange}
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
    pending: state.admin.get('pending'),
    successfully: state.admin.get('successfully')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUser(name) {
      dispatch(getUser(name))
    },
    editUser(id) {
      dispatch(editUser(id))
    }
  }
}

EditUser.propTypes = {
  getUser: propTypes.func,
  editUser: propTypes.func,
  user: propTypes.object,
  pending: propTypes.bool,
  successfully: propTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
