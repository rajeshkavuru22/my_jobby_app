import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
      </Link>
      <ul className="tabs-container">
        <Link to="/">
          <li className="route">
            <AiFillHome className="icon" />
          </li>
        </Link>
        <Link to="/jobs">
          <li className="route">
            <BsFillBriefcaseFill className="icon" />
          </li>
        </Link>
        <button className="route-btn" type="button" onClick={onClickLogout}>
          <FiLogOut className="icon" />
        </button>
      </ul>
      <ul className="routes-container">
        <Link to="/" className="job-link">
          <li className="route">Home</li>
        </Link>
        <Link to="/jobs" className="job-link">
          <li className="route">Jobs</li>
        </Link>
      </ul>
      <button className="logout-btn" type="button" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Header
