import React from 'react'

import Paper from 'material-ui/Paper'
import FlatButton  from 'material-ui/FlatButton'
import FontIcon  from 'material-ui/FontIcon'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import {List, ListItem} from 'material-ui/List'

import './Position.css'

export default (props) => (
  <Paper zDepth={1} className="Position">
    <Toolbar>
      <ToolbarGroup  >
        <ToolbarTitle text="Position" /> 
      </ToolbarGroup>
      <ToolbarGroup>
        <FlatButton  label="Refesh Position" primary={true} onClick={props.onRefresh}/>
      </ToolbarGroup>
    </Toolbar>
    <List>
      <ListItem primaryText={<div><div style={{ float: 'left' }}>{props.currentLocation.fullName}</div><div style={{ float: 'right' }}>
      1 2 14
      </div></div>} leftIcon={<FontIcon className="material-icons">my_location</FontIcon>} />
    </List>
  </Paper>
)