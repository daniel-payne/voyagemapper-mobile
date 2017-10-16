import React, { Component } from 'react'

import Position   from '../interface/components/position/Position'

class MockPosition extends Component {

    state = {
      currentLocation : { 
        fullName:  'Position Unknown' 
      }
    }

    refresh = () => {
      this.setState( {currentLocation: { fullName:  'Somewhere nice' }} )
    }
  
    render = () => (
         <Position currentLocation={this.state.currentLocation} onRefresh={this.refresh} />
    )

  }

export default MockPosition
