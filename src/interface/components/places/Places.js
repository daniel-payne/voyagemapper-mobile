import React from 'react'

import Paper from 'material-ui/Paper'
import FlatButton  from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

import './Places.css' 

export default (props) => (
  <Paper zDepth={1} className="Places">
    <Toolbar>
      <ToolbarGroup  >
        <ToolbarTitle text="Places" /> 
      </ToolbarGroup>
      <ToolbarGroup>
        <FlatButton  label="Add Place" primary={true} />
      </ToolbarGroup>
    </Toolbar>
    <p>{ JSON.stringify(props.userPlaces) }</p>
  </Paper>
)