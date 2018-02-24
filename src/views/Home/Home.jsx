import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import { Loading, Card, Button, Tooltip } from 'element-react'
import Search from '../../components/Search'
import { getAllTags } from '../../actions/tag'
import { getQuestions, getQuestionsLimited } from '../../actions/question'
import QuestionListItem from '../../components/QuestionListItem'

class Home extends Component {
  state = {
    limitCounter: 5
  }

  componentDidMount() {
    this.props.getAllTags()
    this.props.getQuestionsLimited(this.state.limitCounter)

    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  loadMore = () => {
    this.setState(
      {
        limitCounter: this.state.limitCounter + 5
      },
      () => {
        this.props.getQuestionsLimited(this.state.limitCounter)
      }
    )
  }

  handleScroll = () => {
    if (this.refs.searchBox == null) return

    let columnWidth = ReactDOM.findDOMNode(this.refs.column).offsetWidth

    if (window.pageYOffset > 200) {
      let element = ReactDOM.findDOMNode(this.refs.searchBox).style

      element.position = 'fixed'
      element.width = `${columnWidth - 16}px`
    } else if (window.pageYOffset < 75) {
      let element = ReactDOM.findDOMNode(this.refs.searchBox).style

      element.position = 'inherit'
      element.width = 'auto'
    }
  }

  render() {
    const { loadMore } = this
    const {
      userName,
      authenticated,
      tags,
      questions,
      questionsAmount
    } = this.props

    let popularTags = []

    tags.forEach((el, index) => {
      if (popularTags.length <= 10) {
        if (el.questions.length) {
          popularTags.push(el)
        }
      }
    })

    return (
      <DocumentTitle title="GeekAsks –– Последнее">
        <div id="homepage" className="page" ref="homePage">
          {!userName && authenticated ? (
            <Loading fullscreen={true} text="Загружаем..." />
          ) : (
            <div>
              <Header />
              <div className="container">
                <div className="row">
                  <div className="col-sm-9 col-xs-12" ref="column">
                    <Search ref="searchBox" />

                    <div className="row-fluid">
                      <div className="questions-feed">
                        <h3 className="title title--md">Лента вопросов</h3>
                        {questions.map((question, index) => {
                          return (
                            <QuestionListItem
                              key={index}
                              isSolved={question.solved}
                              question={question}
                              index={index}
                            />
                          )
                        })}
                        {questions.length < questionsAmount ? (
                          <Button
                            className="questions-more"
                            onClick={loadMore}
                            type="success"
                          >
                            Ещё
                          </Button>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-12 xs-top">
                    <Card
                      className="popular-tags"
                      header={
                        <div className="clearfix">
                          <p className="title title--xs">Популярные теги</p>
                        </div>
                      }
                    >
                      <ul className="popular-tags__list row">
                        {popularTags.map((el, index, arr) => {
                          return (
                            <Tooltip
                              key={index}
                              content={`${el.title}, ${el.questions.length}`}
                              placement="top"
                            >
                              <li className="popular-tags__list__item col-xs-4 col-sm-4 col-md-3">
                                <Link to={`/tag/${el.title}`}>
                                  <img
                                    src={require(`../../uploads/tags/${
                                      el.cover
                                    }`)}
                                    alt="cover"
                                  />
                                </Link>
                              </li>
                            </Tooltip>
                          )
                        })}
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.get('authenticated'),
    userName: state.user.get('userName'),
    tags: state.tag.get('tags'),
    questions: state.question.get('questions'),
    questionsAmount: state.question.get('questionsAmount')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllTags() {
      dispatch(getAllTags())
    },
    getQuestions() {
      dispatch(getQuestions())
    },
    getQuestionsLimited(limit) {
      dispatch(getQuestionsLimited(limit))
    }
  }
}

Home.propTypes = {
  authenticated: propTypes.bool.isRequired,
  userName: propTypes.string,
  tags: propTypes.array.isRequired,
  getAllTags: propTypes.func.isRequired,
  getQuestions: propTypes.func.isRequired,
  questions: propTypes.array.isRequired,
  questionsAmount: propTypes.number,
  getQuestionsLimited: propTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
