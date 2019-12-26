export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_DONE = 'FETCH_USER_DONE'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'

export const fetchUser = () => {
  return ({
    type: FETCH_USER
  })
}
