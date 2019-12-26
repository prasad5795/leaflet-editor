export default class NoTaskError extends Error {
  constructor () {
    super('No more tasks')
  }
}
