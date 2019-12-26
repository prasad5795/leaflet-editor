import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  fetchUser
} from '../actions'
import Validation from '../views/Validation'
// import Realignment from '../views/Realignment'
import Editor from '../views/Editor'
// import Completeness from '../views/Completeness'
// import Deletion from '../views/Deletion'
// import Kicker from '../views/Kicker'
// import ShiftCheck from '../views/Shift'
// import Disabled from '../views/Disabled'

import application from '../utils/application'
// import SourceValidation from '../views/SourceValidation'
// eslint-disable-next-line no-undef

class Router extends React.Component {
  componentDidMount () {
    this.props.fetchUser()
  }

  render () {
    if (this.props.user.id) {
      return (
        <main>
          <Switch>
            <Redirect from={'/'} to={application.endpoints.validator} exact />
            {/* <Route path={application.endpoints.completeness} component={Completeness} /> */}
            <Route path={application.endpoints.validator} component={Validation} />
            {/* <Route path={application.endpoints.realignment} component={Realignment} /> */}
            <Route path={application.endpoints.editor} component={Editor} />
            {/* <Route path={application.endpoints.kicker} component={this.props.user.roles.includes('ROLE_QTEAM') ? Kicker : Disabled} /> */}
            {/* <Route path={application.endpoints.sourcevalidator} component={SourceValidation} /> */}
            {/* <Route path={application.endpoints.deletion} component={Deletion} /> */}
            {/* <Route path={application.endpoints.shift} component={ShiftCheck} /> */}
          </Switch>
        </main>
      )
    } else {
      return (
        <div className={application.elements.loadingIndicator} />
      )
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, { fetchUser })(Router)
