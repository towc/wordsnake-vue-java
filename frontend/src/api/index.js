const config = require('../config').default;

module.exports = config.api.mock ? require('./mock') : require('./real');
