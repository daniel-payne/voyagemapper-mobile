import React, {Component} from 'react'
// import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconMap from 'material-ui/svg-icons/maps/map'

const routes = {
  0: 'dashboard',
  1: 'map',
}
const pages = {
  dashboard: 0,
  map:       1,
}

class Footer extends Component {
  state = {
    selectedIndex: 0,
  };

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: pages[this.props.history.location.pathname.replace('/','')],
    }
  }

  updateSelection = (location, action) => {
    let newPath  = location.pathname.replace('/','')
    let newIndex = pages[newPath] === undefined ? -1 :  pages[newPath] 
     
    const newState = {
      selectedIndex: newIndex
    }

    this.setState(newState)
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(this.updateSelection)
  }

  componentWillUnmount() {
      this.unlisten()
  }

  setNewPath = (index) => {
    this.props.history.push(routes[index])
  }

  render() {
    return (
      <Paper zDepth={1} className="Footer">

        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label='Dashboard'
            icon={<FontIcon className="material-icons">dashboard</FontIcon>}
            onClick={() => this.setNewPath(pages['dashboard'])}
          />
          <BottomNavigationItem
            label="Map"
            icon={<IconMap />}
            onClick={() => this.setNewPath(pages['map'])}
          />
        </BottomNavigation>
      </Paper>
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
)(withRouter(Footer))

