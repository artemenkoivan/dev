import React from 'react'

export function splitAnswersAmount(str) {
  let string = str.split(' ')

  return (
    <div className="questions-details__answers">
      <span className="title title--md title--gray">{string[0]}</span>
      <span className="text text--gray text--xs">{string[1]}</span>
    </div>
  )
}
