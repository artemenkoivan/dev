import React from 'react'
import { Link } from 'react-router-dom'
import { splitAnswersAmount } from '../helpers/questionHelpers'
import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export default function QuestionListItem({ question, index, isSolved }) {

  return (
    <div className="questions-feed__item" key={ index }>
      <div className="questions-feed__item__tags box box-row">
        { question.tags.map((tag, index) => {
            return (
              <Link to={`/tag/${tag.title}`} className="question-tag text text--xs box box-row box-v-center" key={index}>
                <img src={require(`../uploads/tags/${tag.cover}`)}
                     alt={ tag.title }
                     className="question-tag__img" />
                <p className="question-tag__name">{ tag.title }</p>
              </Link>
            )
          })
        }
      </div>
      <div className="questions-details box box-v-center box-h-between">
        <Link to={`/question/${question._id}`} className="questions-details__title title title--sm title--black">{ question.title }</Link>
        { isSolved ? <p className="questions-details__solved"><i className="fa fa-check" /></p> : '' }
        { splitAnswersAmount(question.answers) }
      </div>
      <div className="question-time">
        <time className="text text--gray text--xs">{ moment(question.createdAt).startOf('minute').fromNow() }</time>
      </div>
    </div>
  )
}
