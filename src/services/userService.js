
import { FETCH_USER } from '../actions/userActions'
import axios from 'axios'

// eslint-disable-next-line no-undef
let identityEndpoint = process.env.REACT_APP_AUTHORIZATION_IDENTITY

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // trigger cognito login page
      window.location = window.location.href
    }
    return Promise.reject(error)
  }
)

const fetchUser = () => {
  return new Promise((resolve, reject) => {
    axios.get(identityEndpoint, { withCredentials: true })
      .then(res => {
        if (res.status !== 200) {
          reject(new Error('Error retrieving user details'))
        }
        resolve(res.data)
      })
      .catch(error => {
        console.error('Error retrieving user details:', error)
        reject(new Error('Error retrieving user details'))
      })
  })
}

export default function userService(action) {
  switch (action.type) {
  case FETCH_USER: 
    //return fetchUser()
    console.log("inside fetch user")
    return Promise.resolve({ id: 'christophe.brunelle@tomtom.com', roles: ['ROLE_QTEAM'] })
  default:
    console.warn('Unhandled action')
  }
}
