import React, { Component } from 'react'

import Itinerary   from '../interface/components/itinerary/Itinerary'

class MockItinerary extends Component {

    state = {
      currentLocation : { 
        fullName:  'Position Unknown' 
      }
    }

    refresh = () => {
      this.setState( {currentLocation: { fullName:  'Somewhere nice' }} )
    }
  
    render = () => (
         <Itinerary />
    )

  }

export default MockItinerary
