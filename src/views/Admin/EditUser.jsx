import React, { Component } from 'react'
import Header from '../../components/Header'
import { Link } from 'react-router-dom' 
import DocumentTitle from 'react-document-title'

class EditUser extends Component {

  render() {

    const routeUserName = this.props.match.params.name
    return (
      <DocumentTitle title={`GeekAsks –– Пользователь ${routeUserName}`}>
        <div id="editUserPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h3 className="page-title">
                  <Link to="/admin">Администрирование сайтом</Link> / Пользователь {routeUserName}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default EditUser