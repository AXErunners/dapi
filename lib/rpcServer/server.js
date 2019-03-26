const jayson = require('jayson/promise');
const { isRegtest, isDevnet } = require('../utils');
const errorHandlerDecorator = require('./errorHandlerDecorator');

const estimateFee = require('./commands/estimateFee');
const getAddressSummary = require('./commands/getAddressSummary');
const getAddressTotalReceived = require('./commands/getAddressTotalReceived');
const getAddressTotalSent = require('./commands/getAddressTotalSent');
const getAddressUnconfirmedBalance = require('./commands/getAddressUnconfirmedBalance');
const getBalance = require('./commands/getBalance');
const getBestBlockHash = require('./commands/getBestBlockHash');
const getBestBlockHeight = require('./commands/getBestBlockHeight');
const getBlockHash = require('./commands/getBlockHash');
const getBlocks = require('./commands/getBlocks');
const getHistoricBlockchainDataSyncStatus = require('./commands/getHistoricBlockchainDataSyncStatus');
const getMempoolInfo = require('./commands/getMempoolInfo');
const getMNList = require('./commands/getMNList');
const getMnListDiff = require('./commands/getMnListDiff');
const getPeerDataSyncStatus = require('./commands/getPeerDataSyncStatus');
const getRawBlock = require('./commands/getRawBlock');
const getStatus = require('./commands/getStatus');
const getTransactionById = require('./commands/getTransactionById');
const getTransactionsByAddress = require('./commands/getTransactionsByAddress');
const getUser = require('./commands/getUser');
const getUTXO = require('./commands/getUTXO');
const getBlockHeader = require('./commands/getBlockHeader');
const getBlockHeaders = require('./commands/getBlockHeaders');
const sendRawTransaction = require('./commands/sendRawTransaction');
const sendRawIxTransaction = require('./commands/sendRawIxTransaction');
const generate = require('./commands/generate');
const sendRawTransition = require('./commands/sendRawTransition');
const fetchDapContract = require('./commands/fetchDapContract');
const fetchDapObjects = require('./commands/fetchDapObjects');
const searchUsers = require('./commands/searchUsers');
const loadBloomFilter = require('./commands/loadBloomFilter');
const addToBloomFilter = require('./commands/addToBloomFilter');
const clearBloomFilter = require('./commands/clearBloomFilter');
const getSpvData = require('./commands/getSpvData');
const findDataForBlock = require('./commands/findDataForBlock');
const getQuorum = require('./commands/getQuorum');

// Following commands are not implemented yet:
// const getVersion = require('./commands/getVersion');

const createCommands = (insightAPI, axecoreAPI, axeDriveAPI, userIndex) => ({
  estimateFee: estimateFee(insightAPI),
  getAddressSummary: getAddressSummary(insightAPI({ maxTransactionHistory: 1000 })),
  getAddressTotalReceived: getAddressTotalReceived(insightAPI),
  getAddressTotalSent: getAddressTotalSent(insightAPI),
  getAddressUnconfirmedBalance: getAddressUnconfirmedBalance(insightAPI),
  getBalance: getBalance(insightAPI),
  getBestBlockHash: getBestBlockHash(axecoreAPI),
  getBestBlockHeight: getBestBlockHeight(axecoreAPI),
  getBlockHash: getBlockHash(axecoreAPI),
  getBlocks: getBlocks(insightAPI),
  getHistoricBlockchainDataSyncStatus: getHistoricBlockchainDataSyncStatus(insightAPI),
  getMempoolInfo: getMempoolInfo(axecoreAPI),
  getMNList: getMNList(insightAPI),
  getMnListDiff: getMnListDiff(axecoreAPI),
  getPeerDataSyncStatus: getPeerDataSyncStatus(insightAPI),
  getRawBlock: getRawBlock(insightAPI),
  getStatus: getStatus(insightAPI),
  getTransactionById: getTransactionById(insightAPI),
  getTransactionsByAddress: getTransactionsByAddress(insightAPI),
  getUTXO: getUTXO(insightAPI),
  getUser: getUser(axecoreAPI),
  getBlockHeader: getBlockHeader(axecoreAPI),
  getBlockHeaders: getBlockHeaders(axecoreAPI),
  sendRawTransaction: sendRawTransaction(axecoreAPI),
  sendRawIxTransaction: sendRawIxTransaction(axecoreAPI),
  getQuorum: getQuorum(axecoreAPI),

  // Methods that are using AxeDrive
  sendRawTransition: sendRawTransition(axecoreAPI, axeDriveAPI),
  fetchDapContract: fetchDapContract(axeDriveAPI),
  fetchDapObjects: fetchDapObjects(axeDriveAPI),
  searchUsers: searchUsers(userIndex),
});

const createRegtestCommands = axecoreAPI => ({
  generate: generate(axecoreAPI),
});

const createSpvServiceCommands = spvService => ({
  loadBloomFilter: loadBloomFilter(spvService),
  addToBloomFilter: addToBloomFilter(spvService),
  clearBloomFilter: clearBloomFilter(spvService),
  getSpvData: getSpvData(spvService),
  findDataForBlock: findDataForBlock(spvService),
});

/**
  * Starts RPC server
 *  @param options
  * @param {number} options.port - port to listen for incoming RPC connections
  * @param {string} options.networkType
  * @param {object} options.spvService
  * @param {object} options.insightAPI
  * @param {object} options.axecoreAPI
  * @param {AbstractAxeDriveAdapter} options.axeDriveAPI - AxeDrive api adapter
  * @param {object} options.userIndex
  * @param {object} options.log
 */
const start = ({
  port, networkType, spvService, insightAPI, axecoreAPI, axeDriveAPI, userIndex, log,
}) => {
  const spvCommands = createSpvServiceCommands(spvService);
  const commands = createCommands(insightAPI, axecoreAPI, axeDriveAPI, userIndex);
  const areRegtestCommandsEnabled = isRegtest(networkType) || isDevnet(networkType);

  const allCommands = areRegtestCommandsEnabled
    ? Object.assign(commands, spvCommands, createRegtestCommands(axecoreAPI))
    : Object.assign(commands, spvCommands);

  /*
  Decorate all commands with decorator that will intercept errors and format
  them before passing to user.
  */
  Object.keys(allCommands).forEach((commandName) => {
    allCommands[commandName] = errorHandlerDecorator(allCommands[commandName], log);
  });

  const server = jayson.server(allCommands);
  server.http().listen(port);
};

module.exports = {
  createCommands,
  start,
};
