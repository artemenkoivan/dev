import React from 'react'
import { Button } from 'element-react'
import { Link } from 'react-router-dom'

const QuestionAnswer = props => {
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
      <span className="question-answers__item__body">{props.item.body}</span>
      <footer className="answer-footer">
        <Button
          className="like-answer"
          type="success"
          size="small"
          onClick={() =>
            props.likeAnswer({
              id: props.item._id,
              userName: props.userName,
              questionId: props.singleQuestion.questionId
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
          <span>Коментарии ({props.item.comments.length})</span>
        </a>
      </footer>
    </div>
  )
}

export default QuestionAnswer
