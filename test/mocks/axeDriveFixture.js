/* eslint class-methods-use-this: off */
/* eslint-disable no-unused-vars */
// Unused variables represent signatures for clarity
const AbstractAxeDriveAdapter = require('../../lib/externalApis/axeDriveAdapter/AbstractAxeDriveAdapter');

// Create a class, so JSDoc would work properly in our tests
class AxeDriveFixture extends AbstractAxeDriveAdapter {
  addSTPacket(rawStateTransition, rawSTPacket) { return Promise.resolve(); }

  fetchDapContract(contractId) { return Promise.resolve({}); }
}

module.exports = new AxeDriveFixture();
