import Logger from '.';

describe('Logger', () => {
  describe('#constructor', () => {
    it('should exist and be a function', () => {
      expect(Logger).to.exist().and.be.a('Function');
    });

    it('should return a Logger instance', () => {
      expect(new Logger()).to.be.an.instanceOf(Logger);
    });

    it('should register logs on process errors');
  });

  describe('::log', () => {
    let logger;

    beforeEach(() => {
      logger = new Logger();
    });

    it('should exist and be a function', () => {
      expect(logger.log).to.exist().and.be.a('Function');
    });
  });

  describe('::error', () => {
    let logger;

    beforeEach(() => {
      logger = new Logger();
    });

    it('should exist and be a function', () => {
      expect(logger.error).to.exist().and.be.a('Function');
    });
  });
});
