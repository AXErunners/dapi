const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const fetchDapObjectsFactory = require('../../../../lib/rpcServer/commands/fetchDapObjects');
const AxeDriveAdapter = require('../../../../lib/externalApis/axeDriveAdapter');

const axeDriveAdapter = new AxeDriveAdapter({ host: 'host', port: 1 });

chai.use(chaiAsPromised);
const { expect } = chai;

const expectedSearchParams = { contractId: '123', type: 'contact', options: { where: { userId: 1 } } };
const expectedResult = [{ contractId: '123', type: 'contact', userId: 1 }];

describe('fetchDapContract', () => {
  describe('#factory', () => {
    it('should return a function', () => {
      const fetchDapObjects = fetchDapObjectsFactory(axeDriveAdapter);
      expect(fetchDapObjects).to.be.a('function');
    });
  });

  before(() => {
    sinon.stub(axeDriveAdapter, 'fetchDapObjects')
      .withArgs(expectedSearchParams.contractId, expectedSearchParams.type,
        expectedSearchParams.options).returns(Promise.resolve(expectedResult));
  });

  beforeEach(() => {
    axeDriveAdapter.fetchDapObjects.resetHistory();
  });

  after(() => {
    axeDriveAdapter.fetchDapObjects.restore();
  });

  it('Should return dap objects', async () => {
    const fetchDapObjects = fetchDapObjectsFactory(axeDriveAdapter);
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    const dapObjects = await fetchDapObjects(expectedSearchParams);
    expect(dapObjects).to.be.equal(expectedResult);
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(1);
  });

  it('Should throw an error if arguments are not valid', async () => {
    const fetchDapObjects = fetchDapObjectsFactory(axeDriveAdapter);
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({ contractId: 123 })).to.be.rejectedWith('params.contractId should be string');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({ contractId: '123' })).to.be.rejectedWith('params should have required property \'type\'');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({ contractId: '123', type: 1 })).to.be.rejectedWith('params.type should be string');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({ contractId: '123', type: 'type' })).to.be.rejectedWith('params should have required property \'options\'');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({ contractId: '123', type: 'type', options: 1 })).to.be.rejectedWith('params.options should be object');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects({})).to.be.rejectedWith('params should have required property \'contractId\'');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects()).to.be.rejectedWith('params should be object');
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects([123])).to.be.rejected;
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
    await expect(fetchDapObjects([-1])).to.be.rejected;
    expect(axeDriveAdapter.fetchDapObjects.callCount).to.be.equal(0);
  });
});
