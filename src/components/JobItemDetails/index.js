import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaExternalLinkAlt} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobItem: {},
    skillsList: [],
    isLoading: false,
    similarJobsList: [],
    lifeAtCompany: {},
    jobItemDetailsApiResponseStatus: false,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({isLoading: true})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const Item = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        companyWebsiteUrl: data.job_details.company_website_url,
      }
      this.setState({
        jobItem: Item,
        skillsList: data.job_details.skills,
        similarJobsList: data.similar_jobs,
        lifeAtCompany: data.job_details.life_at_company,
        jobItemDetailsApiResponseStatus: true,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false, jobItemDetailsApiResponseStatus: false})
    }
  }

  retryJobItemDetails = () => {
    this.getJobItemDetails()
  }

  renderLoader = () => (
    <div className="loader" testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="no-jobs-img"
        />
        <h1 className="head">Oops! Something Went Wrong</h1>
        <p className="note">
          we cannot seem to find the page you are looking for.
        </p>
        <button
          className="retry-btn"
          type="button"
          onClick={this.retryJobItemDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderSkillItem = each => (
    <li className="list-item" key={each.name}>
      <img src={each.image_url} alt={each.name} className="skill-img" />
      <p className="Name">{each.name}</p>
    </li>
  )

  renderLifeAtCompany = () => {
    const {lifeAtCompany} = this.state
    return (
      <>
        <h1 className="Head">Life at Company</h1>
        <div className="description-image-container">
          <p className="Description">{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.image_url}
            alt="life at company"
            className="life-image"
          />
        </div>
      </>
    )
  }

  renderSimilarJobItem = each => (
    <li className="job-item" key={each.id}>
      <div className="top-container">
        <img
          src={each.company_logo_url}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-rating-container">
          <h1 className="title">{each.title}</h1>
          <div className="type-container">
            <AiFillStar className="star" />
            <p className="text">{each.rating}</p>
          </div>
        </div>
      </div>
      <hr className="hrline" />
      <h1 className="Head">Description</h1>
      <p className="job-description">{each.job_description}</p>
      <div className="middle-container">
        <div className="location-type-container">
          <div className="type-container">
            <MdLocationOn className="icon" />
            <p>{each.location}</p>
          </div>
          <div className="type-container">
            <BsFillBriefcaseFill className="icon" />
            <p>{each.employment_type}</p>
          </div>
        </div>
      </div>
    </li>
  )

  renderJobItemDetails = () => {
    const {jobItem, skillsList, similarJobsList} = this.state

    const {
      title,
      companyLogoUrl,
      location,
      jobDescription,
      employmentType,
      packagePerAnnum,
      rating,
      companyWebsiteUrl,
    } = jobItem

    return (
      <div className="content-container">
        <div className="item-container">
          <div className="top-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hrline" />
          <div className="heading-visit-container">
            <h1 className="head">Description</h1>
            <a className="hyperlink-container" href={companyWebsiteUrl}>
              <p>Visit</p>
              <FaExternalLinkAlt className="link" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <div className="skills">
            <h1 className="Head">Skills</h1>
            <ul className="skills-list">
              {skillsList.map(each => this.renderSkillItem(each))}
            </ul>
          </div>
          <div className="life-container">{this.renderLifeAtCompany()}</div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="Head">Similar Jobs</h1>
          <ul className="jobs-list">
            {similarJobsList.map(each => this.renderSimilarJobItem(each))}
          </ul>
        </div>
      </div>
    )
  }

  renderResult = () => {
    const {jobItemDetailsApiResponseStatus} = this.state
    if (jobItemDetailsApiResponseStatus) {
      return this.renderJobItemDetails()
    }
    return this.renderFailureView()
  }

  render() {
    const {isLoading} = this.state

    return (
      <>
        <Header />
        {isLoading ? this.renderLoader() : this.renderResult()}
      </>
    )
  }
}

export default JobItemDetails
