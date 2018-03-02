import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { splitAnswersAmount } from '../helpers/questionHelpers'
import countAmount from '../helpers/countAmount'
import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const TagQuestion = ({ question }) => {
  const answersAmount = countAmount(question.answers.length, [
    'ответ',
    'ответа',
    'ответов'
  ])

  return (
    <div className="tag-questions__item">
      <div className="questions-details box box-v-center box-h-between">
        <Link
          to={`/question/${question._id}`}
          className="questions-details__title title title--sm title--black"
        >
          {question.title}
        </Link>
        {question.solved ? (
          <p className="questions-details__solved">
            <i className="fa fa-check" />
          </p>
        ) : (
          ''
        )}
        {splitAnswersAmount(answersAmount)}
      </div>
      <div className="question-time">
        <time className="text text--gray text--xs">
          {moment(question.createdAt)
            .startOf('minute')
            .fromNow()}
        </time>
      </div>
    </div>
  )
}

export default TagQuestion
