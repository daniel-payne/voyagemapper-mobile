import React from 'react'

import Paper from 'material-ui/Paper'
import FlatButton  from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

import './Itinerary.css'

export default (props) => (
  <Paper zDepth={1} className="Itinerary" >
      <Toolbar>
        <ToolbarGroup  >
          <ToolbarTitle text="Itinerary" /> 
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton  label="Add Travel" primary={true} />
        </ToolbarGroup>
      </Toolbar>
    <p>{ JSON.stringify(props.userItinerary) }</p>
  </Paper>
)