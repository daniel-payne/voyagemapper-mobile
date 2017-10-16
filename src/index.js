import React                 from 'react'
import { render }            from 'react-dom'
import { Provider }          from 'react-redux'
import { ConnectedRouter }   from 'react-router-redux'
import injectTapEventPlugin  from 'react-tap-event-plugin'

import registerServiceWorker from './registerServiceWorker'
import store, { history }    from './data/store'
import Application           from './application/Application'

import './index.css'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Application/>
    </ConnectedRouter>
  </Provider>,
  target
)

registerServiceWorker()
