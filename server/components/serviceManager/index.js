import _ from 'lodash';

import UnknownServiceError from './unknownServiceError';
import AlreadyExistingServiceError from './alreadyExistingServiceError';

export default class ServiceManager {
  constructor() {
    this.services = {};
  }

  get(serviceName) {
    if (!this.services[serviceName]) {
      throw new UnknownServiceError();
    }

    return this.services[serviceName];
  }

  set(serviceName, service) {
    if (_.has(this.services, serviceName)) {
      throw new AlreadyExistingServiceError();
    }

    this.services[serviceName] = service;
  }
}
