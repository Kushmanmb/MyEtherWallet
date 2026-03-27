import EthCalls from '../web3Calls';
import { toPayload } from '../jsonrpc';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_call') return next();
  const ethCalls = new EthCalls(requestManager);
  try {
    const result = await ethCalls.call(
      payload.params[0],
      payload.params[1] || 'latest'
    );
    res(null, toPayload(payload.id, result));
  } catch (e) {
    res(e);
  }
};
