import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Button, Input, AutoComplete, Select, Message } from 'element-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { connect } from 'react-redux'
import { githubGist } from 'react-syntax-highlighter/styles/hljs'
import { getTag } from '../actions/tag'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { createQuestion } from '../actions/question'

class Editor extends Component {
  constructor() {
    super()

    this.state = {
      syntax: '',
      tagValue: '',
      preview: false,
      title: '',
      tags: [],
      body: '',
      options: [
        {
          value: 'javascript',
          label: 'JavaScript'
        },
        {
          value: 'css',
          label: 'CSS'
        },
        {
          value: 'html',
          label: 'HTML'
        },
        {
          value: 'php',
          label: 'PHP'
        },
        {
          value: 'python',
          label: 'Python'
        },
        {
          value: 'ruby',
          label: 'Ruby'
        },
        {
          value: 'java',
          label: 'Java'
        },
        {
          value: 'perl',
          label: 'Perl'
        },
        {
          value: 'bash',
          label: 'Bash'
        },
        {
          value: 'typescript',
          label: 'TypeScript'
        },
        {
          value: 'json',
          label: 'JSON'
        },
        {
          value: 'cs',
          label: 'C#'
        },
        {
          value: 'objectivec',
          label: 'Objective-c'
        },
        {
          value: 'swift',
          label: 'Swift'
        },
        {
          value: 'xml',
          label: 'XML'
        }
      ]
    }
  }

  togglePreview = e => {
    e.preventDefault()
    this.setState({
      body: this.refs.textarea.refs.textarea.value
    })

    let { title, tags } = this.state

    if (_.isEmpty(title)) {
      return Message.error('Заголовок не может быть пустым!')
    }

    if (!_.endsWith(title, '?')) {
      return Message.error('Заголовок должен содержать знак вопроса!')
    }

    if (_.isEmpty(tags)) {
      return Message.error('Нужно выбрать по крайней мере 1 тег!')
    }

    if (tags.length > 3) {
      return Message.error('Не более 3 тегов!')
    }

    if (_.isEmpty(this.refs.textarea.refs.textarea.value)) {
      return Message.error('Вопрос не должен быть пустым!')
    }

    if (this.refs.textarea.refs.textarea.value.length < 50) {
      return Message.error('Вопрос должен содержать минимум 50 символов')
    }

    this.setState({
      preview: !this.state.preview
    })
  }

  _handleAddCode = e => {
    this.refs.textarea.refs.textarea.value += `<code lang="${e}"></code>`
  }

  searchTags = (tagName, callback) => {
    this.setState({
      tagValue: tagName
    })

    if (_.size(tagName)) {
      this.props.searchTag(tagName)

      setTimeout(() => {
        callback(this.props.results)
      }, 500)
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    let { title, body, tags } = this.state

    let data = {
      title,
      body: JSON.stringify(body),
      tags,
      userId: localStorage.getItem('_id')
    }

    this.props.createQuestion(data)
    this.props.history.push('/')
  }

  handleSelect = tag => {
    let tags = [...this.state.tags]
    tags.push(tag)

    this.setState({ tags, tagValue: '' })
  }

  _handleAddBlockQuote = e => {
    e.preventDefault()

    this.refs.textarea.refs.textarea.value += '<blockquote> </blockquote>'
  }

  _handleAddLink = e => {
    e.preventDefault()

    let link = prompt('Введите URL ссылки', 'http://')

    if (!_.isNull(link) && !_.isEmpty(link)) {
      this.refs.textarea.refs.textarea.value += `<a href=${link}> </a>`
    }
  }

  _handleAddBold = e => {
    e.preventDefault()

    this.refs.textarea.refs.textarea.value += '<b> </b>'
  }

  _parseString(str) {
    let div = document.createElement('div')
    div.innerHTML = str

    let nodes = div.childNodes

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3) {
        let p = document.createElement('p')

        p.textContent = nodes[i].textContent
        div.replaceChild(p, nodes[i])
      }
    }

    let res = div.innerHTML
    let cleanParser = new DOMParser()

    return _.map(
      cleanParser.parseFromString(res, 'text/html').body.children,
      el => el
    )
  }

  handleTitleChange = e => {
    this.setState({ title: e })
  }

  render() {
    const { preview, body, tags, tagValue, title } = this.state
    const {
      togglePreview,
      _handleAddCode,
      _handleAddLink,
      _handleAddBold,
      _handleAddBlockQuote,
      _parseString,
      searchTags,
      handleSelect,
      handleSubmit,
      handleTitleChange
    } = this

    return (
      <div>
        {/* PREVIEW */}
        <div
          className="editor-preview"
          style={{ display: preview ? 'block' : 'none' }}
        >
          <h3 className="editor__title title--sm">Предосмотр:</h3>
          <h3 className="title title--sm">{title}</h3>
          {_parseString(body).map((el, index) => {
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

          <div className="editor__buttons">
            <Button type="success" size="small" onClick={handleSubmit}>
              Опубликовать
            </Button>
            <Button type="warning" size="small" onClick={togglePreview}>
              Редактировать
            </Button>
          </div>
        </div>

        {/* EDITOR */}
        <div className="editor" style={{ display: preview ? 'none' : 'block' }}>
          <h3 className="editor__title title--sm">Суть вопроса</h3>
          <p className="text text--xs text--gray">
            Сформулируйте вопрос так, чтобы сразу было понятно, о чём речь.
          </p>
          <Input
            value={title}
            onChange={handleTitleChange}
            className="editor__title-input"
          />
          <h3 className="editor__title title--sm">Теги вопроса</h3>
          {!!tags.length && (
            <ul className="selected-tags">
              {tags.map((tag, index) => {
                return (
                  <li key={index} className="selected-tags__item">
                    {tag.value}
                  </li>
                )
              })}
            </ul>
          )}
          <AutoComplete
            ref="tags"
            className="editor__tags-input"
            placeholder="Выберите тег"
            value={tagValue}
            fetchSuggestions={searchTags}
            onSelect={handleSelect}
          />
          <h3 className="editor__title title--sm">Детали</h3>
          <p className="text text--xs text--gray">
            Опишите в подробностях свой вопрос, чтобы получить более точный
            ответ.
          </p>
          <div className="editor-panel">
            <Button.Group>
              <Select
                placeholder="Синтаксис"
                className="syntax-select"
                value={this.state.syntax}
                onChange={_handleAddCode}
                clearable={true}
              >
                {this.state.options.map(el => {
                  return (
                    <Select.Option
                      key={el.value}
                      label={el.label}
                      value={el.value}
                    />
                  )
                })}
              </Select>
              <Button type="primary" onClick={_handleAddLink}>
                <i className="fa fa-link" />
              </Button>
              <Button type="primary">
                <i className="fa fa-image" />
              </Button>
              <Button type="primary" onClick={_handleAddBold}>
                <i className="fa fa-bold" />
              </Button>
              <Button type="primary" onClick={_handleAddBlockQuote}>
                <i className="fa fa-quote-right" />
              </Button>
            </Button.Group>
          </div>

          <Input
            type="textarea"
            autosize={{ minRows: 10, maxRows: 10 }}
            className="editor__textarea"
            ref="textarea"
          />

          <div className="editor__buttons">
            <Button type="warning" size="small" onClick={togglePreview}>
              Предосмотр
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchTag(tagName) {
      dispatch(getTag(tagName))
    },
    createQuestion(data) {
      dispatch(createQuestion(data))
    }
  }
}

function mapStateToProps(state) {
  return {
    results: state.tag.get('searchTag')
  }
}

const WrappedEditor = withRouter(Editor)

WrappedEditor.propTypes = {
  results: propTypes.array,
  searchTag: propTypes.func,
  createQuestion: propTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedEditor)
