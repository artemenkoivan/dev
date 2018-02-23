import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserInfo, editProfile } from '../../actions/user'
import DocumentTitle from 'react-document-title'
import Upload from '../../components/Upload'
import Header from '../../components/Header'
import { Form, Input, Loading, Button, Message } from 'element-react'
import moment from 'moment'
import { isEmpty } from 'lodash'

class UserSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imagePreviewUrl: '',
      form: {
        email: '',
        formAvatar: null,
        formDescription: ''
      }
    }
  }

  handleImageChange = e => {
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(e.target.files[0])
    this.setState({ form: { formAvatar: e.target.files[0] } })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { formAvatar, formDescription, email } = this.state.form

    let image = new FormData()
    image.append('avatar', formAvatar)

    this.props.editProfile({
      email,
      description: formDescription,
      formAvatar: formAvatar === null ? '' : image,
      _id: localStorage.getItem('_id')
    })
  }

  componentWillReceiveProps(props) {
    if (props.success) {
      Message.success('Изменения сохранены')

      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  onFormChange(key, value) {
    this.setState(state => ({ form: { ...state.form, [key]: value } }))
  }

  componentDidMount() {
    this.props.getUserInfo(localStorage.getItem('_id'))
  }

  render() {
    const {
      props: { userName, avatar, noAvatar, email, createdAt, description },
      state: { imagePreviewUrl, form: { formAvatar, formDescription } },
      handleImageChange,
      onFormChange,
      handleSubmit
    } = this

    return (
      <DocumentTitle title="GeekAsks –– Настройки">
        <div id="settingsPage" className="page">
          <Header />

          {userName ? (
            <div className="container page">
              <div className="row">
                <div className="col-xs-12">
                  <h3 className="page-title">Настройки пользователя</h3>

                  <Form className="settings-form" onSubmit={handleSubmit}>
                    <Form.Item>
                      <Input
                        defaultValue={email}
                        placeholder="E-mail"
                        onChange={onFormChange.bind(this, 'email')}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Input
                        defaultValue={description}
                        placeholder="О себе"
                        type="textarea"
                        onChange={onFormChange.bind(this, 'formDescription')}
                      />
                    </Form.Item>

                    <Form.Item className="avatar-upload">
                      {imagePreviewUrl ? (
                        <div
                          className="avatar-upload__preview"
                          style={{ backgroundImage: `url(${imagePreviewUrl})` }}
                        />
                      ) : (
                        <img
                          className="avatar-upload__preview"
                          src={
                            avatar
                              ? require(`../../uploads/avatars/${avatar}`)
                              : noAvatar
                          }
                        />
                      )}

                      <Upload
                        type="success"
                        size="small"
                        plain={true}
                        action={handleImageChange}
                      />
                    </Form.Item>

                    <div className="settings-form__additional">
                      <p className="text text--sm">
                        <strong>Дата создания: </strong>
                        {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                      </p>
                    </div>

                    <Button size="small" type="success" nativeType="submit">
                      Сохранить настройки
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          ) : (
            <Loading fullscreen={true} text="Загружаем..." />
          )}
        </div>
      </DocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  return {
    userName: state.user.get('userName'),
    avatar: state.user.get('avatar'),
    noAvatar: state.user.get('noAvatar'),
    email: state.user.get('email'),
    description: state.user.get('description'),
    createdAt: state.user.get('createdAt'),
    success: state.user.get('success')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo(id) {
      dispatch(getUserInfo(id))
    },
    editProfile(data) {
      dispatch(editProfile(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
