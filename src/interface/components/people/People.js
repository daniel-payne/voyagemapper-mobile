import React from 'react'

import Paper from 'material-ui/Paper'
import FlatButton  from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

import './People.css'

export default (props) => (
  <Paper zDepth={1} className="People">
    <Toolbar>
      <ToolbarGroup  >
        <ToolbarTitle text="People" /> 
      </ToolbarGroup>
      <ToolbarGroup>
        <FlatButton  label="Invite Person" primary={true} />
      </ToolbarGroup>
    </Toolbar>
    <p>{ JSON.stringify(props.userPeople) }</p>
  </Paper>
)