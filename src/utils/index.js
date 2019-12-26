
// eslint-disable-next-line no-undef
const files = require.context('.', false, /\.js$/)
const utilities = {}

files.keys().forEach(f => {
  if (f === './index.js') return
  utilities[f.replace(/(\.\/|\.js)/g, '')] = files(f).default
})

export default utilities
