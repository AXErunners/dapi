module.exports = {
  getConfigFixture() {
    return {
      insightUri: '123',
      axecore: {
        p2p: {
          host: '123',
          port: '123',
        },
        rpc: {
          host: '123',
          port: '123',
        },
        zmq: {
          port: '123',
          host: '123',
        },
      },
      axeDrive: {
        host: '123',
        port: '123',
      },
      server: {
        port: '123',
      },
    };
  },
};
