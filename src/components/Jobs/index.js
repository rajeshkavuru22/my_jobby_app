import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiResponsesList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    isLoading: false,
    profileDetails: {},
    jobsList: [],
    salaryRange: '',
    employmentType: [],
    search: '',
    searchText: '',
    jobsApiResponseStatus: apiResponsesList.initial,
    profileApiResponseStatus: apiResponsesList.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobItems()
  }

  getProfileDetails = async () => {
    this.setState({
      isLoading: true,
      profileApiResponseStatus: apiResponsesList.inProgress,
    })
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        profileDetails: data.profile_details,
        isLoading: false,
        profileApiResponseStatus: apiResponsesList.success,
      })
    } else {
      this.setState({
        isLoading: false,
        profileApiResponseStatus: apiResponsesList.failure,
      })
    }
  }

  getJobItems = async () => {
    this.setState({
      isLoading: true,
      jobsApiResponseStatus: apiResponsesList.inProgress,
    })
    const {employmentType, salaryRange, search} = this.state
    const employmentTypeFilters = employmentType.join()
    console.log(employmentTypeFilters, salaryRange, search)
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeFilters}&minimum_package=${salaryRange}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const Item = each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      })
      if (data.jobs !== undefined) {
        const jobsList = data.jobs.map(each => Item(each))
        this.setState({
          jobsList,
          isLoading: false,
          jobsApiResponseStatus: apiResponsesList.success,
        })
      }
    } else {
      this.setState({
        isLoading: false,
        jobsApiResponseStatus: apiResponsesList.failure,
      })
    }
  }

  onChangeSearchText = event => {
    this.setState({searchText: event.target.value.toLowerCase()})
  }

  onSearch = () => {
    const {searchText} = this.state
    this.setState({search: searchText}, this.getJobItems)
  }

  retryProfileDetails = () => {
    this.getProfileDetails()
  }

  retryJobItems = () => {
    this.getJobItems()
  }

  jobsSuccessView = List => (
    <div className="jobs-list-container">
      <div className="search-lg-container">
        <input
          className="search"
          type="search"
          placeholder="Search"
          onChange={this.onChangeSearchText}
        />
        <button
          className="btn"
          type="button"
          onClick={this.onSearch}
          testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
      <ul className="unordered-list">
        {List.map(each => (
          <JobItem key={each.id} jobItem={each} />
        ))}
      </ul>
    </div>
  )

  noJobsView = () => (
    <div className="no-jobs-container">
      <div className="search-lg-container">
        <input
          className="search"
          type="search"
          placeholder="Search"
          onChange={this.onChangeSearchText}
        />
        <button
          className="btn"
          type="button"
          onClick={this.onSearch}
          testid="searchButton"
        >
          >
          <BsSearch className="search-icon" />
        </button>
      </div>

      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="head">No Jobs Found</h1>
        <p className="description">
          we could not find any jobs. Try other filters.
        </p>
      </div>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="no-jobs-container">
      <div className="search-lg-container">
        <input
          className="search"
          type="search"
          placeholder="Search"
          onChange={this.onChangeSearchText}
        />
        <button
          className="btn"
          type="button"
          onClick={this.onSearch}
          testid="searchButton"
        >
          >
          <BsSearch className="search-icon" />
        </button>
      </div>

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
          onClick={this.retryJobItems}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderProfileLoader = () => (
    <div className="profile-loader" testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderLoader = () => (
    <div className="loader" testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails, profileApiResponseStatus} = this.state

    const profileSuccessView = () => (
      <div className="profile-container">
        <img
          src={profileDetails.profile_image_url}
          className="profile"
          alt="profile"
        />
        <h1 className="name">{profileDetails.name}</h1>
        <p className="bio">{profileDetails.short_bio}</p>
      </div>
    )

    const profileFailureView = () => (
      <div className="failure-container">
        <button
          className="retry-btn"
          type="button"
          onClick={this.retryProfileDetails}
        >
          Retry
        </button>
      </div>
    )
    switch (profileApiResponseStatus) {
      case apiResponsesList.success:
        return profileSuccessView()
      case apiResponsesList.failure:
        return profileFailureView()
      case apiResponsesList.inProgress:
        return this.renderProfileLoader()
      default:
        return null
    }
  }

  onChecked = event => {
    const {employmentType} = this.state
    if (event.target.checked) {
      const List = [...employmentType, event.target.value]
      this.setState({employmentType: List}, this.getJobItems)
    } else {
      const List = employmentType
      const index = List.indexOf(event.target.value)
      List.splice(index, 1)
      this.setState({employmentType: List}, this.getJobItems)
    }
  }

  typeOfEmployment = () => {
    const employmentItem = each => (
      <li className="Item" key={each.employmentTypeId}>
        <input
          className="checkbox"
          type="checkbox"
          value={each.employmentTypeId}
          onClick={this.onChecked}
        />
        <label className="type">{each.label}</label>
      </li>
    )
    return (
      <div className="type-items-container">
        <h1 className="types-heading">Type of Employment</h1>
        <ul className="unordered-list">
          {employmentTypesList.map(each => employmentItem(each))}
        </ul>
      </div>
    )
  }

  onClickSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobItems)
  }

  salaryRange = () => {
    const salaryRangeItem = each => (
      <li className="Item" key={each.salaryRangeId}>
        <input
          className="radio"
          type="radio"
          value={each.salaryRangeId}
          name="salary"
          onClick={this.onClickSalaryRange}
        />
        <label className="type">{each.label}</label>
      </li>
    )
    return (
      <div className="type-items-container">
        <h1 className="types-heading">Salary Range</h1>
        <ul className="unordered-list">
          {salaryRangesList.map(each => salaryRangeItem(each))}
        </ul>
      </div>
    )
  }

  renderProfileAndFiltersContainer = () => {
    const {searchText} = this.state
    return (
      <div className="container">
        <div className="search-container">
          <input
            className="search"
            type="search"
            placeholder="Search"
            value={searchText}
            onChange={this.onChangeSearchText}
          />
          <button
            className="btn"
            type="button"
            onClick={this.onSearch}
            testid="searchButton"
          >
            >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {this.renderProfileDetails()}
        <hr className="hr-line" />
        {this.typeOfEmployment()}
        <hr className="hr-line" />
        {this.salaryRange()}
      </div>
    )
  }

  renderJobs = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.noJobsView()
    }
    return this.jobsSuccessView(jobsList)
  }

  renderResult = () => {
    const {jobsApiResponseStatus} = this.state
    switch (jobsApiResponseStatus) {
      case apiResponsesList.success:
        return this.renderJobs()
      case apiResponsesList.failure:
        return this.renderJobsFailureView()
      case apiResponsesList.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {isLoading} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          {this.renderProfileAndFiltersContainer()}
          {isLoading ? this.renderLoader() : this.renderResult()}
        </div>
      </>
    )
  }
}

export default Jobs
