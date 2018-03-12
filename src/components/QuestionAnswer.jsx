import React, { Component } from 'react'
import { Button, Input } from 'element-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { saveEditedAnswer, deleteAnswer } from '../actions/question'
import { githubGist } from 'react-syntax-highlighter/styles/hljs'
import { isUndefined, map } from 'lodash'

class QuestionAnswer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      body: JSON.parse(props.item.body)
    }
  }

  toggleAnswerEdit = () => {
    this.setState({ editing: !this.state.editing })
  }
  _parseString(body) {
    if (!isUndefined(body)) {
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

      return map(
        cleanParser.parseFromString(res, 'text/html').body.children,
        el => el
      )
    }
  }

  submitEditedAnswer = () => {
    this.props.saveEditedAnswer({
      body: JSON.stringify(this.state.body),
      _id: this.props.item._id,
      questionId: this.props.singleQuestion.questionId
    })
    this.setState({ editing: false })
  }

  handleChange = value => {
    this.setState({ body: value })
  }

  handleDeleteAnswer = () => {
    let sure = window.confirm('Вы уверены?')

    if (sure) {
      this.props.deleteAnswer({
        _id: this.props.item._id,
        questionId: this.props.singleQuestion.questionId
      })
    }
  }

  render() {
    const props = this.props
    const {
      state: { editing, body },
      toggleAnswerEdit,
      _parseString,
      handleChange,
      handleDeleteAnswer,
      submitEditedAnswer
    } = this

    return (
      <div className="question-answers__item">
        {props.item.author.name ? (
          <Link
            className="text text--bold text--black text--link"
            to={`/user/${props.item.author.name}`}
          >
            {props.item.author.name}
          </Link>
        ) : (
          <p className="text text--bold text--black">Unknown</p>
        )}
        {editing ? (
          <div>
            <Input
              type="textarea"
              autosize={{ minRows: 10, maxRows: 10 }}
              value={body}
              onChange={e => handleChange(e)}
            />
          </div>
        ) : (
          <div className="question-answers__item__body">
            {_parseString(props.item.body).map((el, index) => {
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
                  return <blockquote key={index}>{el.innerHTML}</blockquote>
                default:
                  return <span key={index}>{el.innerHTML}</span>
              }
            })}
          </div>
        )}
        <footer className="answer-footer">
          <Button
            className="like-answer"
            type="success"
            size="small"
            onClick={() =>
              props.likeAnswer({
                id: props.item._id,
                userName: props.userName,
                questionId: props.singleQuestion.questionId,
                toUser: props.item.author
              })
            }
            plain={!props.item.likes.length}
          >
            Нравится ({props.item.likes.length})
          </Button>

          {props.singleQuestion.author._id === localStorage.getItem('_id') && (
            <Button
              size="small"
              plain={!props.isSolved}
              type="success"
              onClick={() =>
                props.markSolved({
                  answerId: props.answerId,
                  questionId: props.singleQuestion.questionId
                })
              }
            >
              Отметить решением <i className="fa fa-check" aria-hidden="true" />
            </Button>
          )}

          <a
            href={`#${props.item._id}`}
            className="answer-comments-link text text--xs"
          >
            {props.isAuthor && (
              <Button.Group>
                <Button type="danger" size="small" onClick={handleDeleteAnswer}>
                  Удалить
                </Button>
                {editing ? (
                  <Button
                    type="success"
                    size="small"
                    onClick={submitEditedAnswer}
                  >
                    Сохранить
                  </Button>
                ) : (
                  <Button
                    type="warning"
                    size="small"
                    onClick={toggleAnswerEdit}
                  >
                    Изменить
                  </Button>
                )}
              </Button.Group>
            )}
          </a>
        </footer>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteAnswer(id) {
      dispatch(deleteAnswer(id))
    },
    saveEditedAnswer(body) {
      dispatch(saveEditedAnswer(body))
    }
  }
}

export default connect(null, mapDispatchToProps)(QuestionAnswer)
