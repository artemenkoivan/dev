import React, { Component } from 'react'
import Header from '../../components/Header'
import DocumentTitle from 'react-document-title'
import { Loading } from 'element-react'
import { connect } from 'react-redux'
import { remove } from '../../actions/notification'
import NotificationItem from '../../components/NotificationItem'

class NotificationsPage extends Component {
  componentDidMount() {
    this.props.remove(localStorage.getItem('_id'))
  }

  render() {
    const { profile } = this.props

    return (
      <DocumentTitle title="GeekAsks –– Уведомления">
        <div id="notificationsPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="page-title">
                  Уведомления ({profile.notifications
                    ? profile.notifications.length
                    : '0'})
                </h2>
              </div>

              <div className="col-xs-12">
                {profile.notifications ? (
                  <div className="notifications-list">
                    {profile.notifications.map((item, index) => {
                      return (
                        <NotificationItem
                          key={index}
                          time={item.notificationTime}
                          text={item.title}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <div className="notifications-loader">
                    <Loading text="Заружаем..." />
                  </div>
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
    profile: state.user.get('profile')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    remove(userId) {
      dispatch(remove(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)
