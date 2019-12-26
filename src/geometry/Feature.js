export default class Feature {
  constructor (coordinates, properties = {}) {
    this.type = 'Feature'
    this.geometry = {
      type: 'LineString',
      coordinates: coordinates
    }
    this.properties = properties
  }
}
