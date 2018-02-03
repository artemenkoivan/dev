import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Input, Form, Button, Message } from 'element-react';
import Upload from '../../components/Upload'
import { createTag } from '../../actions/admin'

class NewTag extends Component {
  constructor() {
    super()

    this.state = {
      imagePreviewUrl: null,
      cover: null,
      form: {
        title: '',
        description: ''
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    let descriptionLength = 20
    let { cover } = this.state
    let { title, description } = this.state.form

    if (title.length < 3 && description.length >= descriptionLength) {
      return Message.error('Введите название тега, минимум 3 символа')
    }

    if (description.length < descriptionLength && title.length >= 3) {
      return Message.error('Добавьте описание тега, минимум 20 символов')
    }

    if (description.length >= descriptionLength && title.length >= 3 && cover === null) {
      return Message.error('Добавьте картинку тега')
    }

    let image = new FormData();
    image.append('cover', cover);
    
    let data = {
      title,
      description,
      cover: image
    }

    this.props.createTag(data)
    
    Message.success('Тег создан')
    setTimeout(() => this.props.history.push('/admin'), 200)
  }

  handleImageChange = e => {
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(e.target.files[0])

    this.setState({ cover: e.target.files[0] }) 
  }

  onFormChange(key, value) {
    this.setState(state => (
      { form: { ...state.form, [key]: value } }
    ))
  }

  render() {
    const {
       handleImageChange,
       onFormChange,
       handleSubmit
    } = this
    const { form, imagePreviewUrl } = this.state

    return (
        <DocumentTitle title="GeekAsks –– Создать тег">
          <div id="newtagpage">
            <Header />

            <div className="container page">
              <div className="row">
                <div className="col-xs-12">
                  <h3 className="page-title"><Link to="/admin">Администрирование сайтом</Link> / Создать тег</h3>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12">
                  <Form model={ form } onSubmit={ handleSubmit } className="admin-form" >
                    <Form.Item>
                      <Input placeholder="Название" 
                             className="tag-name"
                             value={ form.title }
                             onChange={ onFormChange.bind(this, 'title') } />
                    </Form.Item>

                    <Form.Item>
                      <Input placeholder="Описание"
                             resize="none" 
                             type="textarea"
                             value={ form.description }
                             onChange={ onFormChange.bind(this, 'description') } />
                    </Form.Item>

                    <Form.Item className="tag-upload">
                      {imagePreviewUrl &&
                        <div className="tag-upload__preview" style={{backgroundImage: `url(${ imagePreviewUrl })`}}>

                        </div>
                      }

                      <Upload type="success" size="small" plain={true} action={ handleImageChange } />
                    </Form.Item>
                    
                    <Form.Item>
                      <Button nativeType="submit" type="success">Создать</Button>
                    </Form.Item>

                  </Form>
                </div>
              </div>
            </div>
          </div>
        </DocumentTitle>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTag: (data) => {
      dispatch(createTag(data))
    }
  }
}

function mapStateToProps(state) {
  return {
    successfully: state.admin.get('successfully')
  }
}

NewTag.propTypes = {
  createTag: propTypes.func.isRequired,
  successfully: propTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTag)