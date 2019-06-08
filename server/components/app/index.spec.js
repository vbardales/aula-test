import ServiceManager from '../serviceManager';
import app, { start } from '.';
import * as Logger from '../logger';
import * as Server from '../server';

describe('app', () => {
  it('should exist and be a service manager', () => {
    expect(app).to.be.an.instanceOf(ServiceManager);
  });

  describe('#start', () => {
    let app;
    const config = {};
    let logger;
    let server;

    beforeEach(() => {
      app = sinon.createStubInstance(ServiceManager);
      logger = sinon.createStubInstance(Logger.default);
      sinon.stub(Logger, 'default').callsFake(() => logger);
      server = sinon.createStubInstance(Server.default);
      sinon.stub(Server, 'default').callsFake(() => server);
      server.start.resolves();
    });

    afterEach(() => {
      Logger.default.restore();
      Server.default.restore();
    });

    it('should exist and be a function', () => {
      expect(start).to.exist().and.be.a('Function');
    });

    it('should initialize a logger', () => {
      return start(app, config)
        .then(() => {
          expect(Logger.default).to.have.been.calledOnce();
        })
      ;
    });

    it('should initialize a server', () => {
      return start(app, config)
        .then(() => {
          expect(Server.default).to.have.been.calledOnce().and.calledWith(config, logger);
        })
      ;
    });

    // TODO

    it('should start a server', () => {
      return start(app, config)
        .then(() => {
          expect(server.start).to.have.been.calledOnce();
        })
      ;
    });
  });
});
