import BitcoinJsonRpc from 'bitcoin-json-rpc';

const SERVICE_URL='http://localhost:9332';
const rpc = new BitcoinJsonRpc(SERVICE_URL);
export {rpc,SERVICE_URL};