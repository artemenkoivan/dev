import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Loading, Form, Input, Button } from 'element-react'
import Header from '../../components/Header'
import { getTag, editTag } from '../../actions/tag'
import { connect } from 'react-redux'
import Upload from '../../components/Upload'
import { Link } from 'react-router-dom'

class EditTag extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        title: '',
        description: '',
        cover: ''
      },
      imagePreviewUrl: ''
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
        description: tag[0].data.description,
        cover: tag[0].data.cover
      }
    })
  }

  onFormSubmit = event => {
    event.preventDefault()
    const { title, description, cover } = this.state.form
    const {
      title: defaultTitle,
      description: defaultDescription,
      cover: defaultCover
    } = this.props.tag[0].data

    let image = new FormData()
    image.append('cover', cover)

    const form = {
      title: title ? title : defaultTitle,
      description: description ? description : defaultDescription,
      cover: cover ? image : null,
      _id: this.props.tag[0]._id
    }

    this.props.editTag(form)
  }

  onFormChange = (key, value) => {
    this.setState(state => ({ form: { ...state.form, [key]: value } }))
  }

  handleImageChange = e => {
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(e.target.files[0])
    this.setState({ form: { ...this.state.form, cover: e.target.files[0] } })
  }

  render() {
    const tagName = this.props.match.params.name
    const { tag } = this.props
    const {
      onFormChange,
      onFormSubmit,
      handleImageChange,
      state: { form: { title, description }, imagePreviewUrl }
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
                      <Form.Item className="tag-cover-upload">
                        {imagePreviewUrl ? (
                          <div
                            className="tag-cover-upload__preview"
                            style={{
                              backgroundImage: `url(${imagePreviewUrl})`,
                              width: 100,
                              height: 100,
                              display: 'block',
                              backgroundSize: 'cover'
                            }}
                          />
                        ) : (
                          <img
                            className="tag-cover-upload__preview"
                            style={{
                              width: 100,
                              height: 100,
                              display: 'block'
                            }}
                            src={
                              currentTag.data.cover
                                ? require(`../../uploads/tags/${
                                    currentTag.data.cover
                                  }`)
                                : ''
                            }
                          />
                        )}

                        <Upload
                          type="success"
                          size="small"
                          plain={true}
                          action={handleImageChange}
                        />
                      </Form.Item>

                      <Button nativeType="submit" type="success">
                        Сохранить
                      </Button>
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
    },
    editTag(data) {
      dispatch(editTag(data))
    }
  }
}

const mapStateToProps = state => {
  return {
    tag: state.tag.get('searchTag')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTag)
