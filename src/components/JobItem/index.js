import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const jobItem = props

  const {
    id,
    title,
    companyLogoUrl,
    location,
    jobDescription,
    employmentType,
    packagePerAnnum,
    rating,
  } = jobItem.jobItem

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="item-container">
        <div className="top-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="type-container">
              <AiFillStar className="star" />
              <p className="text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="location-type-container">
            <div className="type-container">
              <MdLocationOn className="icon" />
              <p>{location}</p>
            </div>
            <div className="type-container">
              <BsFillBriefcaseFill className="icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <h1 className="package">{packagePerAnnum}</h1>
        </div>
        <hr className="hrline" />
        <h1 className="head">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
