const chai = require('chai');
const sinon = require('sinon');

const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');

const AxeDriveAdapter = require('../../../../lib/externalApis/axeDriveAdapter');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

const { expect } = chai;

describe('AxeDriveAdapter', () => {
  describe('constructor', () => {
    it('Should create axe drive client with given options', () => {
      const axeDrive = new AxeDriveAdapter({ host: '127.0.0.1', port: 3000 });

      expect(axeDrive.client.options.host).to.be.equal('127.0.0.1');
      expect(axeDrive.client.options.port).to.be.equal(3000);
    });
  });

  describe('#addSTPacket', () => {
    it('Should call \'addStPacket\' RPC with the given parameters', async () => {
      const axeDrive = new AxeDriveAdapter({ host: '127.0.0.1', port: 3000 });

      const rawSTPacket = 'stPacket';
      const rawStateTransition = 'stateTransition';
      const method = 'addSTPacket';

      sinon.stub(axeDrive.client, 'request')
        .withArgs(method, { stateTransition: rawStateTransition, stPacket: rawSTPacket })
        .returns(Promise.resolve({ result: undefined }));

      expect(axeDrive.client.request.callCount).to.be.equal(0);

      const result = await axeDrive.addSTPacket(rawStateTransition, rawSTPacket);

      expect(axeDrive.client.request.callCount).to.be.equal(1);
      expect(result).to.be.undefined();
    });
  });

  describe('#fetchDPContract', () => {
    it('Should call \'fetchDPContract\' RPC with the given parameters', async () => {
      const axeDrive = new AxeDriveAdapter({ host: '127.0.0.1', port: 3000 });

      const contractId = 'contractId';
      const method = 'fetchDPContract';

      const expectedDapContract = { contractId };

      sinon.stub(axeDrive.client, 'request')
        .withArgs(method, { contractId })
        .returns(Promise.resolve({ result: expectedDapContract }));

      expect(axeDrive.client.request.callCount).to.be.equal(0);

      const actualDapContract = await axeDrive.fetchDapContract(contractId);

      expect(axeDrive.client.request.callCount).to.be.equal(1);
      expect(actualDapContract).to.be.equal(expectedDapContract);
      expect(actualDapContract).not.to.be.equal({ contractId: 'randomid' });
    });
  });

  describe('#fetchDPObjects', () => {
    it('Should call \'fetchDPObjects\' RPC with the given parameters', async () => {
      const axeDrive = new AxeDriveAdapter({ host: '127.0.0.1', port: 3000 });

      const contractId = 'contractId';
      const type = 'contact';
      const options = { where: { id: 1 } };
      const method = 'fetchDPObjects';

      const expectedDapObjects = [{ contractId, id: 1 }];


      sinon.stub(axeDrive.client, 'request')
        .withArgs(method, { contractId, type, options })
        .returns(Promise.resolve({ result: expectedDapObjects }));

      expect(axeDrive.client.request.callCount).to.be.equal(0);

      const actualDapObjects = await axeDrive.fetchDapObjects(contractId, type, options);

      expect(axeDrive.client.request.callCount).to.be.equal(1);
      expect(actualDapObjects).to.be.equal(expectedDapObjects);
      expect(actualDapObjects).not.to.be.equal([{ contractId, id: 2 }]);
    });
  });
});
