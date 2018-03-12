import React, { Component } from 'react'
import Header from '../../components/Header'
import DocumentTitle from 'react-document-title'
import { Loading } from 'element-react'
import { connect } from 'react-redux'

class NotificationsPage extends Component {
  render() {
    const { profile } = this.props

    console.log(profile)
    return (
      <DocumentTitle title="GeekAsks –– Уведомления">
        <div id="notificationsPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="page-title">Уведомления</h2>
              </div>

              <div className="col-xs-12">
                {profile.notifications ? (
                  <div className="notifications-list">
                    yes: {profile.notifications.length}
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

export default connect(mapStateToProps, {})(NotificationsPage)
