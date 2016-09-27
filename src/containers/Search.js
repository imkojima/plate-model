import { SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, makeSearchQuery } from '../actions/articles'
import { setPageType } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import Tags from '../components/Tags'

if (process.env.BROWSER) {
  require('./Section.css')
}

const MAXRESULT = 10
const PAGE = 1

// english to chinese of category

class Search extends Component {
  static fetchData({ params, store }) {
    let keyword = params.keyword
    return store.dispatch( makeSearchQuery(encodeURIComponent(keyword)) ).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    })
  }

  constructor(props) {
    super(props)
    let keyword = this.props.params.keyword
    this.state = {
      keyword: keyword,
      catId: 'News'
    }
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    // const { articlesByUuids, fetchArticlesByUuidIfNeeded, fetchIndexArticles, searchResult, makeSearchQuery, sectionList } = this.props
    const { fetchIndexArticles, makeSearchQuery, sectionList } = this.props
    let keyword = this.state.keyword

    makeSearchQuery(encodeURIComponent(keyword)).then(() =>{
      // console.log( searchResult )
      return
    })
    
    // if fetched before, do nothing
    if (_.get(sectionList, [ 'response', 'length' ], 0) == 0 ) {
      fetchIndexArticles( [ 'sections' ] )
    }

    // // if fetched before, do nothing
    // if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
    //   return
    // }

    // fetchArticlesByUuidIfNeeded(catId, SECTION, {
    //   page: PAGE,
    //   max_results: MAXRESULT
    // })

  }

  componentDidMount() {
    this.props.setPageType(SECTION)
  }

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = nextProps
    let catId = _.get(params, 'section')

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, SECTION, {
      page: PAGE,
      max_results: MAXRESULT
    })
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = this.props
    let catId = _.get(params, 'section')

    let articlesByCat = _.get(articlesByUuids, [ catId ], {})
    if (_.get(articlesByCat, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByCat, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticlesByUuidIfNeeded(catId, SECTION, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { device } = this.context
    const { articlesByUuids, entities, params, sectionList } = this.props
    const catId = _.get(params, 'section')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)
    const section = _.get(params, 'section', null)
    const catName = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)
    const catBox = catName ? <div className="top-title-outer"><h1 className="top-title"> {catName} </h1></div> : null
    const meta = {
      title: catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: `${SITE_META.URL}section/${section}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
      <DocumentMeta {...meta}>
        <Header sectionList={sectionList.response} />

        <div id="main">
          <div className="container text-center">
            {catBox}
          </div>
          <Tags
            articles={articles}
            device={device}
            hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
            loadMore={this.loadMore}
          />
          {this.props.children}
          <Footer sectionList={sectionList.response} />
        </div>
      </DocumentMeta>
    )
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    searchResult: state.searchResult || {}
  }
}

Search.contextTypes = {
  device: React.PropTypes.string
}

export { Search }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchIndexArticles, setPageType })(Search)
