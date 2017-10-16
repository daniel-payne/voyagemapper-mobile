import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    )
  }
}

const LoggedIn = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
)

LoggedIn.muiName = 'IconMenu'

class Header extends Component {
  state = {
    logged: false,
  };

  handleChange = (event, logged) => {
    this.setState({logged: logged})
  };

  onLogin = () => {
    this.props.history.push('login')
  }

  render() {
    return (
      <AppBar 
        title="Prototype"
        iconElementLeft={<IconButton><Menu /></IconButton>}
        iconElementRight={this.state.logged ? <LoggedIn /> : <Login  onClick={this.onLogin}/>}
      />
    )
  }
}

const mapStateToProps = state => ({
  // count: state.counter.count,
  // isIncrementing: state.counter.isIncrementing,
  // isDecrementing: state.counter.isDecrementing
})

const mapDispatchToProps = dispatch => bindActionCreators({
  // changePageToDashboard: () => push('/dashboard'),
  // changePageToMap:       () => push('/map'),
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Header))
