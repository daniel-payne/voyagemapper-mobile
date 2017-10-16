import React from 'react'
import { Route } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { 
  teal500, 
  teal700, 
  teal400, 
  deepOrange500, 
  blueGrey100, 
  blueGrey200, 
  blueGrey500, 
  grey300, 
  darkBlack, 
  white, 
  fullBlack 
} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'

import Header     from './header/Header'
import Footer     from './footer/Footer'

import Home       from '../interface/containers/home/Home'
import About      from '../interface/containers/about/About' 
import Dashboard  from '../interface/containers/dashboard/Dashboard' 
import Login      from '../interface/containers/login/Login'

import startup    from '../data/activities/startup'

// Can be removed in production
import MockPosition   from '../mocks/MockPosition'
import MockItinerary  from '../mocks/MockItinerary'

import './Application.css'

const muiTheme = getMuiTheme({
  palette: getMuiTheme({
    error:              deepOrange500,

    primary1Color:      teal500,
    primary2Color:      teal700,
    primary3Color:      teal400,

    accent1Color:       blueGrey200,
    accent2Color:       blueGrey100,
    accent3Color:       blueGrey500,

    textColor:          darkBlack,
    alternateTextColor: white,

    canvasColor:        white,
    borderColor:        grey300,
    disabledColor:      fade(darkBlack, 0.3),
    pickerHeaderColor:  teal500,
    clockCircleColor:   fade(darkBlack, 0.07),
    shadowColor:        fullBlack,
  }),
}) 

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className={'App'}>     
      <div className="flexContainer">
        <div className="flexHeader">
          <Header />  
        </div>
        <div className="flexContent">  
          {/* Display Containers */} 
          <Route exact path="/"          component={Home} />
          <Route exact path="/about"     component={About} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/login"     component={Login} />
          {/* Display Mocked Components for testing */}
          <Route path="/mockposition"    component={MockPosition} />
          <Route path="/mockitinerary"   component={MockItinerary} />
        </div>
        <div className="flexFooter">
          <Footer />
        </div> 
      </div>
    </div>
  </MuiThemeProvider>
)

startup()

export default App
