import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Loading, Form, Input, Button } from 'element-react'
import Header from '../../components/Header'
import { getTag } from '../../actions/tag'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class EditTag extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        title: '',
        description: ''
      }
    }
  }

  componentWillMount() {
    const name = this.props.match.params.name
    this.props.getTag(name)
  }

  componentWillReceiveProps({ tag }) {
    this.setState({
      form: {
        title: tag[0].data.title,
        description: tag[0].data.description
      }
    })
  }

  onFormSubmit = event => {
    event.preventDefault()
    const { title, description } = this.state.form
    const {
      title: defaultTitle,
      description: defaultDescription
    } = this.props.tag[0].data

    const form = {
      title: title ? title : defaultTitle,
      description: description ? description : defaultDescription
    }

    console.log(form)
  }

  onFormChange = (key, value) => {
    this.setState(state => ({ form: { ...state.form, [key]: value } }))
  }

  render() {
    const tagName = this.props.match.params.name
    const { tag } = this.props
    const {
      onFormChange,
      onFormSubmit,
      state: { form: { title, description } }
    } = this
    const currentTag = tag[0]

    return (
      <DocumentTitle title={`GeekAsks –– Тег ${tagName}`}>
        <div id="editTagPage" className="page">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h3 className="page-title">
                  <Link to="/admin">Администрирование сайтом</Link> / {tagName}
                </h3>
              </div>

              <div className="col-xs-12">
                {currentTag ? (
                  <div>
                    <h1>{currentTag.data.title}</h1>

                    <Form className="editTag-form" onSubmit={onFormSubmit}>
                      <Form.Item>
                        <Input
                          value={title}
                          onChange={e => onFormChange('title', e)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Input
                          value={description}
                          onChange={e => onFormChange('description', e)}
                        />
                      </Form.Item>

                      <Button nativeType="submit">Сохранить</Button>
                    </Form>
                  </div>
                ) : (
                  <Loading fullscreen={true} text="Загружаем..." />
                )}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTag(name) {
      dispatch(getTag(name))
    }
  }
}

const mapStateToProps = state => {
  return {
    tag: state.tag.get('searchTag')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTag)
