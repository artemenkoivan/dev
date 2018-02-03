import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'

import registerServiceWorker from './registerServiceWorker'
import 'element-theme-default'
import './sass/index.css'
import getUser from './helpers/getUser'

getUser()

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('geekasks')
)
registerServiceWorker()
