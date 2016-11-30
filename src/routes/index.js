import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../containers/App'
import Category from '../containers/Category'
import HomeB from '../containers/HomeB'
import Search from '../containers/Search'
import Section from '../containers/Section'
import Tag from '../containers/Tag'
import Topic from '../containers/Topic'

export default function (history = browserHistory) {
  return (
    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path="/" component={App}>
        <IndexRoute component={HomeB} />
        <Route path="category/:category" component={Category}/>
        <Route path="search/:keyword" component={Search} />
        <Route path="section/:section" component={Section}/>
        <Route path="tag/:tagId" component={Tag} />
        <Route path="topic/:topicId" component={Topic} />
      </Route>
    </Router>
  )
}
