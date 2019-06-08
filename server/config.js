export default {
  appName: 'aula-test',
  port: 2000,
  ip: '0.0.0.0',

  routes: {
    root: require('./api/root.js'),
    songGet: require('./api/song/get.js'),
    songPost: require('./api/song/create.js'),
    songPut: require('./api/song/update.js'),
    songDelete: require('./api/song/delete.js'),
    songFind: require('./api/song/find.js'),
    soundfileGet: require('./api/soundfile/get.js'),
  },
};
