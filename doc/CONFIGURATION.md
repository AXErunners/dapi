[Back to the main page](/README.md) 

# DAPI configuration

DAPI is configured via environment variables. So, for example, in order to change rpc server port, you need to run `RPC_SERVER_PORT=3010 npm start`.

## Full list of available options

* `INSIGHT_URI` - string, Insight-API address, default value is `http://127.0.0.1:3001/insight-api-axe`
* `LIVENET` - boolean. Set to true if you are going to run DAPI on the livenet. Defaults to `false`.
* `RPC_SERVER_PORT` - integer. Port on which DAPI server will listen. Defaults to `3000`
* `AXECORE_RPC_PROTOCOL` string. Protocol for connecting to axecore RPC. Defaults to `http`
* `AXECORE_RPC_USER`. Defaults to `axerpc`
* `AXECORE_RPC_PASS`. Defaults to `password`
* `AXECORE_RPC_HOST`. Defaults to `127.0.0.1`
* `AXECORE_RPC_PORT`. Defaults to `30002`
* `AXECORE_ZMQ_HOST`. Defaults to `127.0.0.1`
* `AXECORE_ZMQ_PORT`. Defaults to `30003`
* `AXECORE_P2P_HOST`. Defaults to `127.0.0.1`
* `AXECORE_P2P_PORT`. Defaults to `30001`
* `AXEDRIVE_RPC_HOST`. Defaults to `127.0.0.1`
* `AXEDRIVE_RPC_PORT`. Defaults to `6000`
* `AXECORE_P2P_NETWORK`. Can be `testnet`, `regtest` and `livenet`. Defaults to `testnet` 
* `NETWORK` Can be `testnet`, `regtest` and `livenet` Defaults to `testnet`
* `BLOOM_FILTER_PERSISTENCE_TIMEOUT` - integer. Bloom filter persistence timeout in milliseconds. Defaults to 1 minute.

[Back to the main page](/README.md) 