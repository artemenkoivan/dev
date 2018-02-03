import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const ProfileAnswers = ({ props }) => {
  return (
    <div className="profile-answer-item">
      <div className="box">
        <Link className="questions-details__title title title--xs title--black" to="#">{props.body}</Link>
        <footer>
          <span className="profile-answer-item__solved">{props.solved ? <i className="fa fa-check" /> : ''}</span>
        </footer>
      </div>
    </div>
  )
}

export default ProfileAnswers