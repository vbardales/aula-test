import express from 'express';
import https from 'https';
import http from 'http';
import Joi from 'joi';
import Promise from 'bluebird';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import _ from 'lodash';

const OptionsSchema = Joi.object().keys({
  ssl: Joi.boolean().optional(),
  credentials: Joi.any().optional(),
  port: Joi.any().required(),
  ip: Joi.string().required(),
  appName: Joi.string().required(),
})
  .with('ssl', 'credentials')
;

const RoutesSchema = Joi.object().required().pattern(Joi.string(), Joi.object().keys({
  method: Joi.string().required().allow('POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'PATCH'),
  uri: Joi.string().required(),
  handlers: Joi.array().required().items(Joi.func()),
}));

export default class Server {
  constructor(app, options, routes, logger) {
    Object.defineProperty(this, 'logger', { // not enumerable nor writable
      value: logger,
    });

    Joi.assert(options, OptionsSchema);
    Joi.assert(routes, RoutesSchema);

    this.options = _.pick(options, ['port', 'appName', 'ip']);

    this.expressApp = express();
    this.stream = null;
    this.server = options.ssl ? https.createServer(this.expressApp, options.credentials) :
      http.createServer(this.expressApp);

    this.expressApp.use(helmet());
    this.expressApp.use(compression());
    this.expressApp.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
    this.expressApp.use(bodyParser.json({ limit: '50mb' }));
    this.expressApp.use(methodOverride());
    this.expressApp.use(helmet.noCache());
    this.expressApp.disable('etag');
    this.expressApp.use('/', (req, res, next) => {
      this.logger.log(`[${req.method}][${req.url}] Body:`, req.body);
      next();
    });

    _.forEach(routes, (routeConfig, routeName) => {
      this.expressApp[routeConfig.method.toLowerCase()](routeConfig.uri, routeConfig.handlers);
    });
  }

  /**
   * Check internal instance state to get its state (up or down)
   */
  isUp() {
    return Boolean(this.stream);
  }

  start() {
    if (this.isUp()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.stream = this.server.listen(this.options.port, this.options.ip, () => {
        this.logger.log(`${this.options.appName} server listening on ${this.options.port}, in ` +
          `${this.expressApp.get('env')} mode`);
        resolve();
      });
      this.stream.on('close', () => this.logger.log(`${this.options.appName} server closed`));
    });
  }

  stop() {
    if (!this.isUp()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.stream.close(() => {
        this.stream = null;
        resolve();
      });
    });
  }
}
