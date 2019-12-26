const application = {
  endpoints: {
    base: '/tori',
    validator: '/validator',
    realignment: '/realignment',
    editor: '/editor',
    completeness: '/completeness',
    kicker: '/kicker',
    sourcevalidator: '/sourcevalidator',
    deletion: '/deletion',
    shift: '/shift'
  },
  messages: {
    unableToLoadTask: 'Unable to load task. Try refreshing the page',
    unableToLoadGeometry: 'Unable to load existing geometry. Try refreshing the page',
    loadingData: 'Loading data ...'
  },
  elements: {
    map: 'map',
    loadingIndicator: 'lds-dual-ring',
    loadingDataIndicator: 'loader',
    leaflet: {
      popup: 'leaflet-popup-content'
    },
    noActionNeeded: 'customLeafletBarButton',
    readyToSubmit: 'customLeafletBarButton',
    disableAllInteraction: 'disable-all-interaction'
  }
}

export default application
