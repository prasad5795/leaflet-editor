export default class UnableToFetchTaskError extends Error {
  constructor () {
    super('Unable to retrieve tasks')
  }
}
