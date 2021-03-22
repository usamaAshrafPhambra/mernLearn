import React from 'react'
import Moment from 'react-moment'

const ProfileEducation = ({
  Education: { school, degree, fieldOfStudy, current, to, from, description },
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="DD/MM/YYYY">{from}</Moment>-{' '}
        {!to ? ' Now' : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
          <strong>Degree: </strong> {degree}
      </p>
      <p>
          <strong>Field Of Study: </strong> {fieldOfStudy}
      </p>
      <p>
          <strong>Description: </strong> {description}
      </p>
    </div>
  )
}

export default ProfileEducation
