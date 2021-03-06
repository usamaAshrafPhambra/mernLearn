import React, { useEffect, Fragment } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education' 
import { getCurrentProfile } from '../../actions/profile'
import { Link } from 'react-router-dom'
import { deleteAccount } from '../../actions/profile'

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile()
  }, [getCurrentProfile])

  return profile && loading === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
      <Fragment>
        <DashboardActions />
        <Experience Experience= {profile.Experience}/>
        <Education Education= {profile.Education}/>

        <div className='my-2'>
          <button className='btn btn-danger' onClick={()=> deleteAccount()}>
            <i className='fas fa-user-minus'>
              Delete Account
            </i>
          </button>
        </div>
      </Fragment> 
      ): (
      <Fragment>
          <p>You have not yet setup a profile, please add some info!</p>
          <Link to='create-profile' className='btn btn-primary my-1'>
              Create Profile
          </Link>
      </Fragment>
      )}
    </Fragment>
  )
}

// Dashboard.propTypes = {

// }

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
})

export default connect(mapStateToProps, { getCurrentProfile , deleteAccount })(Dashboard)
