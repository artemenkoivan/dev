import React from 'react'

const Upload = ({ action, type, size, plain }) => {
  return (
    <div className="el-upload el-upload--text">
      <label
        htmlFor="cover"
        className={`el-button el-button--${type} el-button--${size} ${
          plain ? 'is-plain' : ''
        }`}
        type="button"
      >
        <span>Выбрать файл</span>
      </label>
      <input
        type="file"
        id="cover"
        className="el-upload__input"
        onChange={action}
      />
    </div>
  )
}

export default Upload
