import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AutoComplete } from 'element-react'
import { searchQuery } from '../actions/search'
import propTypes from 'prop-types'
import SearchItem from './SearchItem'

class Search extends Component {
  constructor() {
    super()

    this.state = {
      value: ''
    }
  }

  querySearch$ = (queryString, callback) => {
    this.setState({
      value: queryString
    })

    if (queryString.length >= 2 && queryString[0] !== ' ') {
      this.props.searchQuery(queryString)

      setTimeout(() => {
        callback(this.props.results)
      }, 500);
    }

    if (!queryString.length) {
      callback([])
    }
  }

  render() {
    const { value } = this.state
    const { querySearch$ } = this 

    return (
      <div className="search-box">
        <div className="search">
          <AutoComplete
              icon="search"
              placeholder="Найти"
              value={ value }
              fetchSuggestions={ querySearch$ }
              customItem={SearchItem}
          >
          </AutoComplete>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    results: state.search.get('results')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchQuery: (query) => {
      dispatch(searchQuery(query))
    }
  }
}

Search.propTypes = {
  searchQuery: propTypes.func.isRequired,
  results: propTypes.array
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)