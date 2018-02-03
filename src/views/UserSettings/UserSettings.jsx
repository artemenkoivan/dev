import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from '../../actions/user'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import moment from 'moment'

class UserSettings extends Component {
  constructor() {
    super()
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
      }  

    } = this
    console.log(moment(createdAt).format('MMMM Do YYYY, h:mm:ss a'))

    return (
      <DocumentTitle title="GeekAsks –– Настройки">
        <div id="settingsPage" className="page">
          <Header />

          <div className="container">
            <div className="row-fluid">
              
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