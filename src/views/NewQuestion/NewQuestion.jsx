import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import Editor from '../../components/Editor'

class NewQuestion extends Component {

  render() {
    return (
      <DocumentTitle title="GeekAsks –– Задать вопрос">
        <div id="newquestionpage">
          <Header />

          <div className="container page">
            <div className="row-fluid">
              <h3 className="title title--md">Новый вопрос</h3>
            </div>
            <div className="row">
              <div className="col-sm-9 col-xs-12">
                <Editor />
              </div>

              <div className="col-sm-3 col-xs-12">

              </div>
            </div>
          </div>


        </div>
      </DocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewQuestion)
