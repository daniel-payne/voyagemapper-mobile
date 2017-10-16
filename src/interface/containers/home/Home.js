import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync
} from '../../../data/stores/counter'

import login from '../../../data/activities/login'

const Home = props => (
  <div>
    <h1>Home</h1>
    <p>Count: {props.count}</p>

    <div>
      <RaisedButton primary={true}   onClick={props.increment} disabled={props.isIncrementing}>Increment</RaisedButton>
      <RaisedButton secondary={true} onClick={props.incrementAsync} disabled={props.isIncrementing}>Increment</RaisedButton>
    </div>

    <div>
      <button onClick={props.decrement} disabled={props.isDecrementing}>Decrementing</button>
      <button onClick={props.decrementAsync} disabled={props.isDecrementing}>Decrement Async</button>
    </div>

    <button onClick={() => props.changePage()}>Go to about page via redux</button>

    <button onClick={() => login('daniel.payne@keldan.co.uk', '123')}>Login</button>

    { JSON.stringify(props.session) } 
  </div>
)

const mapStateToProps = state => ({
  count: state.counter.count,
  isIncrementing: state.counter.isIncrementing,
  isDecrementing: state.counter.isDecrementing,
  session: state.itinerary.session,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
  changePage: () => push('/about')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)