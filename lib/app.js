// Entry point for DAPI.
const dotenv = require('dotenv');

// Load config from .env
dotenv.config();

const config = require('./config');
const { validateConfig } = require('./config/validator');
const log = require('./log');
const rpcServer = require('./rpcServer/server');
const QuorumService = require('./services/quorum');
const ZmqClient = require('./externalApis/axecore/ZmqClient');
const AxeDriveAdapter = require('./externalApis/axeDriveAdapter');
const { SpvService } = require('./services/spv');
const insightAPI = require('./externalApis/insight');
const axeCoreRpcClient = require('./externalApis/axecore/rpc');
const userIndex = require('./services/userIndex');

async function main() {
  /* Application start */
  const configValidationResult = validateConfig(config);
  if (!configValidationResult.isValid) {
    configValidationResult.validationErrors.forEach(log.error);
    log.log('Aborting DAPI startup due to config validation errors');
    process.exit();
  }

  // Subscribe to events from axecore
  const axeCoreZmqClient = new ZmqClient(config.axecore.zmq.host, config.axecore.zmq.port);
  // Bind logs on ZMQ connection events
  axeCoreZmqClient.on(ZmqClient.events.DISCONNECTED, log.warn);
  axeCoreZmqClient.on(ZmqClient.events.CONNECTION_DELAY, log.warn);
  axeCoreZmqClient.on(ZmqClient.events.MONITOR_ERROR, log.warn);
  // Wait until zmq connection is established
  log.info(`Connecting to axecore ZMQ on ${axeCoreZmqClient.connectionString}`);
  await axeCoreZmqClient.start();
  log.info('Connection to ZMQ established.');

  log.info('Staring quorum service');
  const quorumService = new QuorumService({
    axeCoreRpcClient,
    axeCoreZmqClient,
    log,
  });
  quorumService.start(axeCoreZmqClient);
  log.info('Quorum service started');

  log.info('Starting SPV service');
  const spvService = new SpvService();
  log.info(`SPV service running with ${spvService.clients.length} connected clients`);

  log.info('Connecting to AxeDrive');
  const axeDriveAPI = new AxeDriveAdapter({
    host: config.axeDrive.host,
    port: config.axeDrive.port,
  });

  log.info('Starting username index service');
  userIndex.start({
    axeCoreZmqClient,
    axeCoreRpcClient,
    log,
  });
  log.info('Username index service started');

  // Start RPC server
  log.info('Starting RPC server');
  rpcServer.start({
    port: config.server.port,
    networkType: config.network,
    spvService,
    insightAPI,
    axecoreAPI: axeCoreRpcClient,
    axeDriveAPI,
    userIndex,
    log,
  });
  log.info(`RPC server is listening on port ${config.server.port}`);

  // Display message that everything is ok
  log.info(`Insight uri is ${config.insightUri}`);
  log.info(`DAPI node is up and running in ${config.livenet ? 'livenet' : 'testnet'} mode`);
  log.info(`Network is ${config.network}`);
}

main().catch((e) => {
  log.error(e.stack);
  process.exit();
});

// break on ^C
process.on('SIGINT', () => {
  process.exit();
});
