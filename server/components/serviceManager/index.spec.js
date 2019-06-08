import ServiceManager from '.';
import UnknownServiceError from './unknownServiceError';
import AlreadyExistingServiceError from './alreadyExistingServiceError';

describe('ServiceManager', () => {
  describe('#constructor', () => {
    it('should exist and be a function', () => {
      expect(ServiceManager).to.exist().and.be.a('Function');
    });

    it('should return a Service Manager instance', () => {
      expect(new ServiceManager()).to.be.an.instanceOf(ServiceManager);
    });

    it('should initialize services with no services', () => {
      expect(new ServiceManager()).to.have.property('services').that.deep.equal({});
    });
  });

  describe('::get', () => {
    let serviceManager;
    const serviceName = 'serviceName';
    const service = {};

    beforeEach(() => {
      serviceManager = new ServiceManager();
      serviceManager.services[serviceName] = service;
    });

    it('should exist and be a function', () => {
      expect(serviceManager.get).to.exist().and.be.a('Function');
    });

    it('should throw if given required service does not exist', () => {
      expect(() => serviceManager.get('unknown')).to.throw(UnknownServiceError);
    });

    it('should return the service if found', () => {
      expect(serviceManager.get(serviceName)).to.equal(service);
    });
  });

  describe('::set', () => {
    let serviceManager;
    const serviceName = 'serviceName';
    const service = {};

    beforeEach(() => {
      serviceManager = new ServiceManager();
      serviceManager.services[serviceName] = service;
    });

    it('should exist and be a function', () => {
      expect(serviceManager.set).to.exist().and.be.a('Function');
    });

    it('should throw if service already exist', () => {
      expect(() => serviceManager.set(serviceName)).to.throw(AlreadyExistingServiceError);
    });

    it('should register the service', () => {
      serviceManager.set('newServiceName', service);
      expect(serviceManager.services).to.have.property('newServiceName').that.equal(service);
    });
  });
});
