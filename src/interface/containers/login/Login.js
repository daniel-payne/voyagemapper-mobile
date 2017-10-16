import React, {Component}     from 'react'
import { connect }            from 'react-redux'
import { withRouter }         from 'react-router'

import RaisedButton           from 'material-ui/RaisedButton'
import TextField              from 'material-ui/TextField'
import Paper                  from 'material-ui/Paper'

import login                  from '../../../data/activities/login'
import logout                 from '../../../data/activities/logout'

import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email:    'daniel.payne@keldan.co.uk',
      password: '',
    }
  }

  onLogin = () => {
    const { push } = this.props.history

    if (this.state.email !== '' && this.state.password !== ''){
      login(this.state.email, this.state.password).then(session => {
        if (session.code){
          push('dashboard')
        }
      })

      this.setState({ password: '' })
    }
  }

  onLogout = () => {
    const { session } = this.props 
    const { code }    = session || {}

    logout(code)
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value })
  };
  
  changeEMail = (event) => {
    this.setState({ email: event.target.value })
  };

  render() {
    const { session } = this.props 
    const { code }    = session || {}

    return (
      <div className="login">
        {code === undefined ? (
          <Paper zDepth={5} className="login--connect">
            <TextField
              floatingLabelText="EMail"
              id="text-field-email"
              type="email"
              value={this.state.email}
              onChange={this.changeEMail}
            /><br />
            <TextField
              floatingLabelText="Password"
              id="text-field-password"
              type="password"
              value={this.state.password}
              onChange={this.changePassword}
            /><br />
            <RaisedButton 
              onClick={this.onLogin} 
              className="login--connect-button"
            >Login</RaisedButton>
            <br />
          </Paper>
        ) : (
          <Paper zDepth={5} className="login--disconnect">
            <RaisedButton 
              onClick={this.onLogout} 
              className="login--disconnect-button"
            >Logout</RaisedButton>
            <br />
          </Paper>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  session: state.itinerary.session,
})

export default connect(
  mapStateToProps
)(withRouter(Login))



// state = {
//   email:    undefined,
//   password: undefined
// }

// onLogin = () => {
//   if (this.state.email !== '' && this.state.password !== ''){
//     login(this.state.email, this.state.password)
//     this.setState({ password: '' })
//   }
// }

// updateEMail = (event) =>{
//   this.setState({ EMail: event.target.value })  
// }

// updatePassword = (event) =>{
//   this.setState({ password: event.target.value })  
// }

// render() {
//   const { email, password } = this.state
//   const { session }         = this.props
//   const { code }            = session ? session : {}

//   return (
//     <div>
//       <h1>Login</h1>

//       <h4>{code}</h4>
//       {this.state.EMail}
//       <hr />
//       <div>


//         <TextField 
//           id="text-field-email"      
//           onChange={this.updateEMail}
//           value={this.state.email}
//         /><br />

//         <TextField
//           id="text-field-password"    
//           floatingLabelText="Password"
//           hintText="Password"
//           type="password"
//           value={password}
//           onChange={this.updatePassword}
//         /><br />

//         <RaisedButton onClick={this.onLogin} >Login</RaisedButton>
//       </div>

//     </div>
//   )
// }