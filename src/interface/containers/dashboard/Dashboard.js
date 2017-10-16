import React, {Component} from 'react'
// import { push } from 'react-router-redux'
// import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

// import FontIcon from 'material-ui/FontIcon'
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
// import Paper from 'material-ui/Paper'
// import IconMap from 'material-ui/svg-icons/maps/map'

import Position  from '../../components/position/Position'
import Itinerary from '../../components/itinerary/Itinerary'
import Places    from '../../components/places/Places'
import People    from '../../components/people/People'

import refresh from '../../../data/activities/refresh'

import './Dashboard.css'

class Dashboard extends Component {

  render() {
    return (
      <div className="dashboard">
        
        <div className="item item-position" >
          <Position currentLocation={this.props.currentLocation} onRefresh={refresh} />
        </div>
        <div className="item item-itinerary">
          <Itinerary userItinerary={this.props.userItinerary}/>
        </div>
        <div className="item item-places">
          <Places />
        </div>
        <div className="item item-people">
          <People />
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentLocation: state.geographic.currentLocation,
})

export default connect(
  mapStateToProps,
)(withRouter(Dashboard))
