class QuorumService {
  constructor({
    axeCoreRpcClient, axeCoreZmqClient, log, heartbeatInterval = 10,
  }) {
    this.axeCoreRpcClient = axeCoreRpcClient;
    this.axeCoreZmqClient = axeCoreZmqClient;
    this.log = log;
    this.heartbeatInterval = heartbeatInterval;
    this.isHeartBeat = false;
  }

  start() {
    const {
      log, axeCoreRpcClient, axeCoreZmqClient, heartbeatInterval,
    } = this;
    const newBlockEvent = axeCoreZmqClient.topics.hashblock;
    this.isHeartBeat = false;
    log.debug(`- Init Quorum (heartbeat interval = ${heartbeatInterval} blocks)`);
    /* TODO: error handling for when dapi is started before MN is
    synced and therefore fails to connect with zmq */

    axeCoreZmqClient.on(newBlockEvent, async (msg) => {
      const hash = msg.toString('hex');
      const height = await axeCoreRpcClient.getBestBlockHeight();
      // let's see if we have a new heartbeat and need to migrate/join new quorum
      this.isHeartBeat = height % heartbeatInterval === 0;
      log.debug(newBlockEvent, msg, hash, height, this.isHeartBeat);
      if (this.isHeartBeat) {
        this.migrateClients();
        this.joinQuorum();
      }
    });
  }

  migrateClients() {
    this.log.debug('migrate connected clients');
  }

  async joinQuorum() {
    this.log.debug('join new Quorum');
  }
}

module.exports = QuorumService;
