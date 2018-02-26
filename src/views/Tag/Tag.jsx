import React, { Component } from 'react'
import propTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Loading, Button } from 'element-react'
import Header from '../../components/Header'
import { getTag, follow } from '../../actions/tag'

class Tag extends Component {
  constructor() {
    super()

    this.state = {}
  }

  componentDidMount() {
    this.props.getTag(this.props.match.params.name)
  }

  render() {
    const {
      props: { match: { params: { name } }, searchTag, follow },
      state: {}
    } = this
    const currentTag = searchTag[0]

    return (
      <DocumentTitle title={`GeekAsks –– ${name}`}>
        <div id="tagPage" className="page">
          <Header />

          {currentTag ? (
            <div className="container page">
              <div className="tag-header">
                <div className="tag-header__cover">
                  <img
                    src={require(`../../uploads/tags/${currentTag.data.cover}`)}
                    alt="cover"
                  />
                </div>
                <h3 className="title title--sm tag-header__title">
                  {currentTag.value}
                </h3>

                <p className="text text--center tag-header__description">
                  {currentTag.data.description}
                </p>

                <Button
                  type="success"
                  size="small"
                  onClick={() => follow(currentTag._id)}
                >
                  Подписаться {currentTag.data.subscribers.length}
                </Button>
              </div>
            </div>
          ) : (
            <Loading fullscreen={true} text="Заргужаем..." />
          )}
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = state => {
  return {
    searchTag: state.tag.get('searchTag')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTag(name) {
      dispatch(getTag(name))
    },
    follow(id) {
      dispatch(follow(id))
    }
  }
}

Tag.propTypes = {
  searchTag: propTypes.array,
  getTag: propTypes.func,
  follow: propTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)
