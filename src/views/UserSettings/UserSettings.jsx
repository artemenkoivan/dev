import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from '../../actions/user'
import DocumentTitle from 'react-document-title'
import Upload from '../../components/Upload'
import Header from '../../components/Header'
import { Form } from 'element-react'
import moment from 'moment'

class UserSettings extends Component {
  constructor() {
    super()

    this.state = {
      imagePreviewUrl: '',
      form: {
        userName: '',
        email: '',
        formAvatar: '',
        email: '',
        password: ''
      }
    }
  }


  handleImageChange = (e) => {
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(e.target.files[0])

    this.setState({ form: { formAvatar: e.target.files[0] } }) 
  }

  onFormChange(key, value) {
    this.setState(state => (
      { form: { ...state.form, [key]: value } }
    ))
  }

  componentDidMount() {
    this.props.getUserInfo(localStorage.getItem('_id'))
  }

  render() {
    const { 
      props: {
        userName,
        avatar,
        noAvatar,
        email,
        createdAt
      },
      state: {
        imagePreviewUrl,
        form: {
          formAvatar
        }
      },
      handleImageChange,
      onFormChange
    } = this
    
    // console.log(moment(createdAt).format('MMMM Do YYYY, h:mm:ss a'))
    return (
      <DocumentTitle title="GeekAsks –– Настройки">
        <div id="settingsPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h3 className="page-title">Настройки пользователя</h3>
                
                <Form>
                  <Form.Item className="tag-upload">
                      {imagePreviewUrl &&
                        <div className="tag-upload__preview" style={{backgroundImage: `url(${ imagePreviewUrl })`}}>

                        </div>
                      }

                      <Upload type="success" size="small" plain={true} action={ handleImageChange } />
                    </Form.Item>
                </Form>
              </div>
            </div>
          </div>
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
    createdAt: state.user.get('createdAt')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo(id) {
      dispatch(getUserInfo(id))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)