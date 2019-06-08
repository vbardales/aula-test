import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';

import ServiceManager from '../serviceManager';
import Logger from '../logger';
import Server from '../server';
import Db from '../db';
import SongRepository from '../song/repository.js';
import SoundfileRepository from '../soundfile/repository.js';

const app = exports.app || new ServiceManager();
export default app;

export function start(app, config) {
  const logger = new Logger();
  app.set('logger', logger);

  logger.log(`Welcome in ${config.appName}!`);
  logger.log('Initializing.');

  const routes = _.reduce(config.routes, (routes, route, routeKey) => {
    routes[routeKey] = route.default(app, config, logger);
    return routes;
  }, {});

  const server = new Server(app, _.omit(config, 'routes'), routes, logger);
  app.set('server', server);

  const songDB = new Db('song', path.join(__dirname, 'db', 'song'), logger);
  app.set('db:song', songDB);

  const soundfileDB = new Db('soundfile', path.join(__dirname, 'db', 'soundfile'), logger);
  app.set('db:soundfile', soundfileDB);

  const Soundfiles = new SoundfileRepository(soundfileDB, logger);
  app.set('repository:soundfile', Soundfiles);

  const Songs = new SongRepository(songDB, Soundfiles, logger);
  app.set('repository:song', Songs);

  logger.log('Starting.')

  return server.start()
    .then(() => Promise.all([
      songDB.start(),
      soundfileDB.start(),
    ]))
    .tap(() => logger.log('All is up!'))
    .catch((err) => {
      logger.error(`Shutting down due to: ${err.message}`, err);

      if (config.env === 'test') {
        console.log(err);
        return;
      }

      process.exit(-1);
    })
  ;
}
