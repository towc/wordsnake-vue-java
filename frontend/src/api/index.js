import config from '../config';

module.exports = config.api.mock ? require('./mock') : require('./real')
