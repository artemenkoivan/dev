import React from 'react'
import { Link } from 'react-router-dom'

export default function SearchItem({ item, index }) {
  return (
    <Link to={item.address} key={index} className="search-box__item">
      {item.img && (
        <span className="search-box__item__image">
          <img
            src={
              item.img.includes('no_avatar')
                ? item.img
                : require(`../uploads/tags/${item.img}`)
            }
            alt="img"
          />
        </span>
      )}
      <span>{item.value}</span>
    </Link>
  )
}
