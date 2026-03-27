import ethCall from '@/utils/web3-provider/methods/eth_call';

jest.mock('@/utils/web3-provider/web3Calls', () => {
  return jest.fn().mockImplementation(() => ({
    call: jest.fn()
  }));
});

import EthCalls from '@/utils/web3-provider/web3Calls';

describe('eth_call middleware', () => {
  let mockRes;
  let mockNext;
  let mockEthCallInstance;

  beforeEach(() => {
    mockRes = jest.fn();
    mockNext = jest.fn();
    mockEthCallInstance = { call: jest.fn() };
    EthCalls.mockImplementation(() => mockEthCallInstance);
  });

  it('calls next() when payload method is not eth_call', async () => {
    const req = {
      payload: { method: 'eth_sendTransaction', params: [] },
      requestManager: {}
    };
    await ethCall(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes).not.toHaveBeenCalled();
  });

  it('resolves eth_call and returns result', async () => {
    const expectedResult = '0x000000000000000000000000000000000000000000000000000000000000002a';
    mockEthCallInstance.call.mockResolvedValue(expectedResult);

    const req = {
      payload: {
        id: 1,
        method: 'eth_call',
        params: [{ to: '0xContractAddress', data: '0xdeadbeef' }, 'latest']
      },
      requestManager: {}
    };
    await ethCall(req, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockEthCallInstance.call).toHaveBeenCalledWith(
      { to: '0xContractAddress', data: '0xdeadbeef' },
      'latest'
    );
    expect(mockRes).toHaveBeenCalledWith(null, {
      jsonrpc: '2.0',
      id: 1,
      result: expectedResult
    });
  });

  it('defaults block parameter to "latest" when not provided', async () => {
    mockEthCallInstance.call.mockResolvedValue('0x0');

    const req = {
      payload: {
        id: 2,
        method: 'eth_call',
        params: [{ to: '0xContractAddress', data: '0xcafe' }]
      },
      requestManager: {}
    };
    await ethCall(req, mockRes, mockNext);
    expect(mockEthCallInstance.call).toHaveBeenCalledWith(
      { to: '0xContractAddress', data: '0xcafe' },
      'latest'
    );
  });

  it('calls res with error when eth_call fails', async () => {
    const error = new Error('execution reverted');
    mockEthCallInstance.call.mockRejectedValue(error);

    const req = {
      payload: {
        id: 3,
        method: 'eth_call',
        params: [{ to: '0xContractAddress', data: '0xbad' }, 'latest']
      },
      requestManager: {}
    };
    await ethCall(req, mockRes, mockNext);
    expect(mockRes).toHaveBeenCalledWith(error);
  });
});
