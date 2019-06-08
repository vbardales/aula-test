import 'babel-polyfill';

import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import Promise from 'bluebird';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

// add globals
global.sinon = sinon.createSandbox();
global.expect = chai.expect;
global.sinon.usingPromise(Promise); // use bluebird in sinon.stub promises (resolves, rejects)
// Sinon deletes defaultBehavior, which hold bluebird as promise
global.sinon.reset = function (stub, methodName) {
  const stubToReset = methodName ? stub[methodName] : stub;
  stubToReset.resetHistory();
  const defaultBehavior = stubToReset.defaultBehavior;
  stubToReset.resetBehavior();
  stubToReset.defaultBehavior = defaultBehavior;
  return stubToReset;
};
