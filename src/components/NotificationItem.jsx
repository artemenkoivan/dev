import React from 'react'
import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const NotificationItem = ({ text, time }) => {
  return (
    <div className="notifications-list__item">
      <p className="text">{text}</p>
      <span className="notifications-list__item__time">
        <time className="text text--gray text--xs">
          {moment(time)
            .startOf('minute')
            .fromNow()}
        </time>
      </span>
    </div>
  )
}

export default NotificationItem
