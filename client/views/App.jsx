import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends Component {
  componentDidMount() {

  }

  render() {
    return [
      <div key="main">
        <Link to="/">
          首页
        </Link>
        <Link to="/detail">
          详情页
        </Link>
        <Link to="/hoc">
          hoc
        </Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}
