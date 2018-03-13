import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Loading } from 'element-react'
import Header from '../../components/Header'
import FeedQuestionItem from '../../components/FeedQuestionItem'
import { getProfile } from '../../actions/user'
import propTypes from 'prop-types'

class Feed extends Component {
  componentDidMount() {
    this.props.getProfile(this.props.userName)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userName !== this.props.userName) {
      this.props.getProfile(this.props.userName)
    }
  }

  render() {
    const { props: { profile } } = this

    if (profile.noFeed) {
      return (
        <div className="page" id="feedPage">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="page-title">Моя лента</h2>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <div className="my-feed">
                  <h3>Подпишитесь по крайней мере на один тег</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      if (profile.feed) {
        return (
          <DocumentTitle title="GeekAsks –– Моя лента">
            {profile.feed ? (
              <div className="page" id="feedPage">
                <Header />

                <div className="container page">
                  <div className="row">
                    <div className="col-xs-12">
                      <h2 className="page-title">Моя лента</h2>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12">
                      <div className="my-feed">
                        {profile.feed.map((element, index) => {
                          return (
                            <FeedQuestionItem
                              question={element}
                              index={index}
                              isSolved={!!element.solved}
                              key={index}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Loading fullscreen={true} text="Загружаем вопросы..." />
            )}
          </DocumentTitle>
        )
      } else {
        return <Loading fullscreen={true} text="Загружаем..." />
      }
    }
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

Feed.propTypes = {
  getProfile: propTypes.func,
  profile: propTypes.object,
  userName: propTypes.string
}

export default connect(mapStateToProps, mapDisptachToProps)(Feed)
