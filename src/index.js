import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './containers/Root'
import 'font-awesome/css/font-awesome.min.css'
import { unregister } from './serviceWorker'

ReactDOM.render(<Root />, document.getElementById('root'))

unregister()
