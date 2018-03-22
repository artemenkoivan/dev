import React from 'react'
import { Link } from 'react-router-dom'

export default function SearchItem({ item, index }) {
  console.log(item)

  return (
    <Link to={item.address} key={index} className="search-box__item">
      {item.img && (
        <span className="search-box__item__image">
          <img
            src={
              item.address.includes('tag')
                ? require(`../uploads/tags/${item.img}`)
                : require(`../uploads/avatars/${item.img}`)
            }
            alt="img"
          />
        </span>
      )}
      <span>{item.value}</span>
    </Link>
  )
}
