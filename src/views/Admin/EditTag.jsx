import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'

class EditTag extends Component {
  render() {
    return (
      <DocumentTitle title="Изменить тег">
        <div id="editTagPage" className="page">
          <Header />
        </div>
      </DocumentTitle>
    )
  }
}

export default EditTag
