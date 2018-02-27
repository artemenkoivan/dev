import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import { getProfile } from '../../actions/user'

class Feed extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.userName !== nextProps.userName) {
      nextProps.getProfile(nextProps.userName)
    }
  }

  render() {
    const { props: { userName, profile } } = this

    console.log(profile)
    return (
      <DocumentTitle title="Моя лента">
        <div className="page" id="feedPage">
          <Header />
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = state => {
  return {
    profile: state.user.get('profile'),
    userName: state.user.get('userName')
  }
}

const mapDisptachToProps = dispatch => {
  return {
    getProfile(name) {
      dispatch(getProfile(name))
    }
  }
}

export default connect(mapStateToProps, mapDisptachToProps)(Feed)
