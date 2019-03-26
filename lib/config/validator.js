const { isUnsignedInteger } = require('@axerunners/axecore-lib').util.js;

/**
 * @param host
 * @param parameterName
 * @returns {{isValid: boolean, validationError: null|string}}
 */
function validateHost(host, parameterName) {
  const validationResult = {
    isValid: typeof host === 'string' && host.length > 0,
    validationError: null,
  };
  if (!validationResult.isValid) {
    validationResult.validationError = `${parameterName} value is not valid. Valid host or ip address expected, found: ${host}`;
  }
  return validationResult;
}

/**
 * @param {number|string} port
 * @param {string} parameterName
 * @returns {{isValid: boolean, validationError: null|string}}
 */
function validatePort(port, parameterName) {
  const validationResult = {
    isValid: isUnsignedInteger(Number(port)) && Number(port) <= 65535,
    validationError: null,
  };
  if (!validationResult.isValid) {
    validationResult.validationError = `${parameterName} value is not valid. Valid port expected, found: ${port}`;
  }
  return validationResult;
}

/**
 * @param {Object} config
 * @returns {{isValid: boolean, validationErrors: (string|null)[]}}
 */
function validateConfig(config) {
  const validationResults = [];
  validationResults.push(validateHost(config.insightUri, 'INSIGHT_URI'));
  validationResults.push(validateHost(config.axecore.p2p.host, 'AXECORE_P2P_HOST'));
  validationResults.push(validatePort(config.axecore.p2p.port, 'AXECORE_P2P_PORT'));
  validationResults.push(validateHost(config.axecore.rpc.host, 'AXECORE_RPC_HOST'));
  validationResults.push(validatePort(config.axecore.rpc.port, 'AXECORE_RPC_PORT'));
  validationResults.push(validateHost(config.axecore.zmq.host, 'AXECORE_ZMQ_HOST'));
  validationResults.push(validatePort(config.axecore.zmq.port, 'AXECORE_ZMQ_PORT'));
  validationResults.push(validateHost(config.axeDrive.host, 'AXEDRIVE_RPC_HOST'));
  validationResults.push(validatePort(config.axeDrive.port, 'AXEDRIVE_RPC_PORT'));
  validationResults.push(validatePort(config.server.port.toString(), 'RPC_SERVER_PORT'));

  const validationErrors = validationResults
    .filter(validationResult => !validationResult.isValid)
    .map(validationResult => validationResult.validationError);

  return {
    isValid: validationErrors.length < 1,
    validationErrors,
  };
}

module.exports = {
  validateHost,
  validatePort,
  validateConfig,
};
