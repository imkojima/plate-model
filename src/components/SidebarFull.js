/* global $ */
import { Link } from 'react-router'
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
import ga from 'react-ga'
import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./SidebarFull.css')
}

export default class SidebarFull extends Component {
	constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  componentDidMount() {
    // console.log('componentDidMount')
    $.site('change setting', 'silent', true)  
    
    $('.ui.left.sidebar').sidebar('hide')

    $('.closeSidebar').click( function () { 
      $('.ui.left.sidebar').sidebar('hide')
      $('#curtain').hide()
    })
    
    $('input.search').parent().submit( function ( event ) {
      $(location).attr('href', '/search/'+$('input.search').val())
      event.preventDefault()
    })

    $('.closeSearchSidebar').click( function () { 
      $('.ui.top.sidebar').sidebar('hide')
      $('#curtain').hide()
    })

    $('.sidebar')
    .sidebar({
      onHide: function() { console.log('on hidden'); }
    })
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'sidebarFull'
    })
  }

  render() {
  	const { pathName, sectionList } = this.props
  	let currentSection = pathName.split('/')[2]
  	let sidebarList = _.result(_.find(sectionList.sections, { 'name': currentSection }), 'categories')

  	return (
  		<div>
  			<section className="ui top sidebar sidebarFull">
	        <div className="ui transparent input searchbar">
	          <div className="close closeSearchSidebar"><img src="/asset/icon/sidebar-close.png" className="sidebar-icon close" /></div>
	          <form style={{ width: '100%', fontSize: '0 !important' }}>
	            <input className="search" type="text" placeholder="搜尋" />
	          </form>
	        </div>
	      </section>
	      <section className="ui left sidebar sidebarFull">
	      	<div className="closeSidebar">
	      		<img src="/asset/icon/sidebar-close.png" className="sidebar-icon close" />
	      		<span>CLOSE THE MENU</span>
	      	</div>
	      	<div className="ui borderless vertical menu">
	      		<Link to={pathName} key={pathName} className="item" onClick={ this._handleClick } >主頁</Link>
	      		<div className="horizDivider"></div>
	      		{ _.map(sidebarList, (s)=>{
	      			return (
	      				<Link to={'/category/' + s.name} key={s.id} className="item" onClick={ this._handleClick } >{ s.title }</Link>
	      			)
	      		})}
	      	</div>
	      </section>
  		</div>
  	)
  }
}

export { SidebarFull }
