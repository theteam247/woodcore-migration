import BitcoinJsonRpc from 'bitcoin-json-rpc';

const SERVICE_URL = location.origin;
const rpc = new BitcoinJsonRpc(SERVICE_URL);
export {rpc, SERVICE_URL};