import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/styles/hljs'
import {
  getOneQuestion,
  addAnswer,
  likeAnswer,
  markSolved
} from '../../actions/question'
import { getUserInfo } from '../../actions/user'
import { Loading, Input, Button } from 'element-react'
import QuestionAnswer from '../../components/QuestionAnswer'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import _ from 'lodash'

class QuestionPage extends Component {
  componentDidMount() {
    let { getOneQuestion, getUserInfo, singleQuestion, match } = this.props

    getOneQuestion(match.params.id)

    if (singleQuestion.author) {
      getUserInfo(singleQuestion.author)
    }
  }

  _parseString(body) {
    if (!_.isUndefined(body)) {
      let str = JSON.parse(body)

      let container = document.createElement('div')
      container.innerHTML = str

      let nodes = container.childNodes

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 3) {
          let p = document.createElement('p')

          p.textContent = nodes[i].textContent
          container.replaceChild(p, nodes[i])
        }
      }

      let res = container.innerHTML
      let cleanParser = new DOMParser()

      return _.map(
        cleanParser.parseFromString(res, 'text/html').body.children,
        el => el
      )
    }
  }

  submitAnswer = e => {
    e.preventDefault()
    const { singleQuestion, addAnswer, userName } = this.props

    const answer = {
      body: this.refs.textarea.refs.textarea.value,
      author: localStorage.getItem('_id'),
      userName,
      questionId: singleQuestion.questionId
    }

    addAnswer(answer)
  }

  render() {
    const { _parseString, submitAnswer } = this
    const {
      singleQuestion,
      authenticated,
      userName,
      likeAnswer,
      noAvatar,
      markSolved
    } = this.props

    return (
      <DocumentTitle
        title={singleQuestion.title ? singleQuestion.title : 'GeekAsks'}
      >
        <div id="questionpage">
          <Header />

          {_.isEmpty(singleQuestion) ? (
            <Loading loading={true} fullscreen={true} />
          ) : (
            <div className="container page">
              <div className="row-fluid">
                <div className="question-author">
                  <Link
                    to={`/user/${singleQuestion.author.userName}`}
                    className="text text--bold"
                  >
                    <img
                      src={
                        singleQuestion.author.avatar
                          ? require(`../../uploads/avatars/${
                              singleQuestion.author.avatar
                            }`)
                          : noAvatar
                      }
                      className="question-author__avatar"
                      alt="img"
                    />
                    <span className="question-author__name">
                      {singleQuestion.author.userName}
                    </span>
                  </Link>

                  <span className="question-author__email text text--gray text--xs">{`#${
                    singleQuestion.author.email
                  }`}</span>
                </div>
              </div>
              <div className="row-fluid">
                <ul className="selected-tags">
                  {singleQuestion.tags &&
                    singleQuestion.tags.map((tag, index) => {
                      return (
                        <li key={index} className="selected-tags__item">
                          <img
                            src={require(`../../uploads/tags/${tag.cover}`)}
                            alt="tag"
                          />
                          <span>{tag.title}</span>
                        </li>
                      )
                    })}
                </ul>
              </div>
              <div className="row-fluid">
                <h3 className="title question-title title--sm">
                  {singleQuestion.title}
                </h3>
              </div>
              <div className="row-fluid">
                <div className="question-body">
                  {singleQuestion.body &&
                    _parseString(singleQuestion.body).map((el, index) => {
                      switch (el.tagName) {
                        case 'CODE':
                          return (
                            <SyntaxHighlighter
                              key={index}
                              language={el.getAttribute('lang')}
                              style={githubGist}
                            >
                              {el.innerHTML}
                            </SyntaxHighlighter>
                          )
                        case 'A':
                          return (
                            <a
                              href={`${el.getAttribute('href')}`}
                              key={index}
                              style={{ textDecoration: 'underline' }}
                            >
                              {el.innerHTML}
                            </a>
                          )
                        case 'B':
                          return <b key={index}>{el.innerHTML}</b>
                        case 'BLOCKQUOTE':
                          return (
                            <blockquote key={index}>{el.innerHTML}</blockquote>
                          )
                        default:
                          return <span key={index}>{el.innerHTML}</span>
                      }
                    })}
                </div>
              </div>

              <div className="answers-container">
                {singleQuestion.answers && (
                  <div className="row-fluid">
                    <h3 className="title title--xs">
                      Ответы на вопрос ({singleQuestion.answers
                        ? singleQuestion.answers.length
                        : 0})
                    </h3>

                    <div className="question-answers">
                      {singleQuestion.answers.map((item, index) => {
                        return (
                          <QuestionAnswer
                            likeAnswer={likeAnswer}
                            item={item}
                            key={index}
                            answerId={item._id}
                            userName={userName}
                            isSolved={item.solved}
                            markSolved={markSolved}
                            singleQuestion={singleQuestion}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}

                {authenticated ? (
                  <div className="row-fluid">
                    <div className="new-comment">
                      <h3 className="title title--xs">Ваш ответ на вопрос</h3>

                      <div className="new-comment__body">
                        <Input
                          type="textarea"
                          autosize={{ minRows: 5, maxRows: 10 }}
                          className="new-comment__textarea"
                          ref="textarea"
                        />
                      </div>
                      <Button
                        className="new-comment__submit"
                        type="success"
                        onClick={submitAnswer}
                        size="small"
                      >
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="box box-center answer-login">
                    <p className="text text--xs">
                      <Link
                        to="/login"
                        className="el-button el-button--success el-button--small"
                      >
                        Войдите
                      </Link>{' '}
                      чтоб ответить на вопрос
                    </p>
                  </div>
                )}
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
    singleQuestion: state.question.get('singleQuestion'),
    userName: state.user.get('userName'),
    email: state.user.get('email'),
    avatar: state.user.get('avatar'),
    noAvatar: state.user.get('noAvatar'),
    authenticated: state.auth.get('authenticated')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getOneQuestion(id) {
      dispatch(getOneQuestion(id))
    },
    getUserInfo(id) {
      dispatch(getUserInfo(id))
    },
    addAnswer(data) {
      dispatch(addAnswer(data))
    },
    likeAnswer(id) {
      dispatch(likeAnswer(id))
    },
    markSolved(id) {
      dispatch(markSolved(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage)

const object = {
  page1: {
    title: 'title',
    body: 'body blblbllblbl',
    subbody: {
      title: 'safsaf',
      body: 'blalbllalbla'
    }
  }
}
