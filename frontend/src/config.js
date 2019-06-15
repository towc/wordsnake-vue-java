// false if empty, true in any other case
const envToBoolean = name => !!process.env[name];

const envOrDefault = (name, def) => process.env[name] || def;

const isTesting = process.env.NODE_ENV === 'testing';

export default {
  testing: isTesting,
  api: {
    mock: envToBoolean('VUE_APP_MOCK_API') || isTesting,
    baseUrl: envOrDefault('VUE_APP_API_URL', 'http://localhost:5000/api'),

    noiseChars: '.-~:+!#()'.split(''),
  },
};
