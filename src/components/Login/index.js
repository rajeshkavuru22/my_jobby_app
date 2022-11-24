import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  addUsername = event => {
    const Value = event.target.value
    this.setState({username: Value})
  }

  addPassword = event => {
    const Value = event.target.value
    this.setState({password: Value})
  }

  onSuccessLogin = jwtToken => {
    this.setState({showErrorMsg: false})
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const jwtToken = data.jwt_token
      this.onSuccessLogin(jwtToken)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showErrorMsg} = this.state
    return (
      <div className="bg-container">
        <form onSubmit={this.onSubmitForm} className="form">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <div className="input-container">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              className="input"
              type="text"
              id="username"
              placeholder="Username"
              onChange={this.addUsername}
              value={username}
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="input"
              type="password"
              id="password"
              placeholder="Password"
              onChange={this.addPassword}
              value={password}
            />
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
