import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { getProfile } from '../../actions/user'
import Header from '../../components/Header'
import QuestionListItem from '../../components/QuestionListItem'
import { Loading, Tabs, Button } from 'element-react'
import ProfileAnswers from '../../components/ProfileAnswers'

class Profile extends Component {
  state = {
    questionLimit: 5
  }

  componentDidMount() {
    this.props.getProfile(this.props.match.params.name)
  }

  loadMore = () => {
    this.setState({ questionLimit: (this.state.questionLimit += 5) })
  }

  render() {
    const { state: { questionLimit }, loadMore } = this
    const { profile, noAvatar } = this.props
    let percent
    let counter = 0
    let solved = 0
    let color
    const green = '#13CE66'
    const yellow = '#F7BA2A'
    const red = '#FF4949'

    if (profile.answers) {
      profile.answers.forEach(el => {
        counter++

        if (el.solved) {
          solved += 1
        }
      })
    }

    if (counter !== 0 && solved !== 0) {
      percent = Math.floor(solved / counter * 100)

      if (percent > 30 && percent < 50) {
        color = yellow
      } else if (percent >= 0 && percent < 30) {
        color = red
      } else if (percent >= 50) {
        color = green
      }
    } else {
      percent = 0
    }

    return (
      <DocumentTitle
        title={
          profile.userName
            ? `GeekAsks | ${profile.userName}`
            : `GeekAsks | Профиль...`
        }
      >
        <div id="profilepage" className="page">
          {!profile.userName || !noAvatar ? (
            <Loading fullscreen={true} text="Загружаем..." />
          ) : (
            <div>
              <Header />
              <div className="container user-profile">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="user-profile__front box box-v-center box-column">
                      <img
                        src={
                          profile.avatar
                            ? require(`../../uploads/avatars/${profile.avatar}`)
                            : noAvatar
                        }
                        alt="avatar"
                        className="user-profile__front__avatar"
                      />
                      <h3 className="title title--sm user-profile__front__name">
                        {profile.userName}
                      </h3>
                      {profile.description && (
                        <p className="text user-profile__front__description">
                          {profile.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row-fluid">
                  <Tabs activeName="1">
                    <Tabs.Pane
                      name="1"
                      label={
                        <Link
                          to="#"
                          className="title title--xs user-profile__activity__amount"
                        >
                          Вопросов {profile.questions.length}
                        </Link>
                      }
                    >
                      {profile.questions.length ? (
                        profile.questions.map((question, index) => {
                          if (index < questionLimit) {
                            return (
                              <QuestionListItem
                                key={index}
                                isSolved={question.solved}
                                question={question}
                                index={index}
                              />
                            )
                          }
                        })
                      ) : (
                        <p>Пользователь пока не задавал вопросов</p>
                      )}

                      {questionLimit >= profile.questions.length ? (
                        ''
                      ) : (
                        <Button
                          type="success"
                          onClick={loadMore}
                          className="user-profile__more-questions"
                        >
                          Ещё
                        </Button>
                      )}
                    </Tabs.Pane>
                    <Tabs.Pane
                      name="2"
                      label={
                        <div>
                          <Link
                            to="#"
                            className="title title--xs user-profile__activity__amount"
                          >
                            Ответов {profile.answers.length}
                          </Link>
                        </div>
                      }
                    >
                      {profile.answers.length ? (
                        profile.answers.map((answer, index) => {
                          return <ProfileAnswers props={answer} key={index} />
                        })
                      ) : (
                        <p>Пользователь пока не отвечал на вопросы</p>
                      )}
                    </Tabs.Pane>
                    <Tabs.Pane
                      name="3"
                      label={
                        <Link
                          to="#"
                          className="title title--xs user-profile__activity__amount"
                        >
                          <span>Решено </span>
                          <span style={{ color }}>{`${percent}%`}</span>
                        </Link>
                      }
                    >
                      {profile.answers.length ? (
                        profile.answers.map((answer, index) => {
                          if (answer.solved) {
                            return <ProfileAnswers props={answer} key={index} />
                          }
                        })
                      ) : (
                        <p>Пользователь не решил ни одного вопроса</p>
                      )}
                    </Tabs.Pane>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
        </div>
      </DocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  return {
    profile: state.user.get('profile'),
    noAvatar: state.user.get('noAvatar'),
    description: state.user.get('description')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProfile(name) {
      dispatch(getProfile(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
