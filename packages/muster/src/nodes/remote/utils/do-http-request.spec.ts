import axios, { AxiosResponse } from 'axios';
import { ErrorNodeDefinition, getMusterNodeTypesMap } from '../../..';
import { doHttpRequest } from './do-http-request';

jest.mock('axios', () => {
  let latestResolve: (response: AxiosResponse<any>) => void;
  let latestReject: (response: any) => void;
  const axios = jest.fn(
    () =>
      new Promise<AxiosResponse<any>>((resolve, reject) => {
        latestResolve = resolve;
        latestReject = reject;
      }),
  );
  const cancellationTokens: Array<{ cancel: jest.Mock<{}> }> = [];
  return Object.assign(axios, {
    getCancellationToken: () => {
      return cancellationTokens[cancellationTokens.length - 1];
    },
    rejectRequest: (ex: any) => {
      latestReject(ex);
    },
    resolveRequest: (response: AxiosResponse<any>) => {
      latestResolve(response);
    },
    isCancel: jest.fn(),
    CancelToken: {
      source: () => {
        const cancellationToken = {
          cancel: jest.fn(),
        };
        cancellationTokens.push(cancellationToken);
        return cancellationToken;
      },
    },
  });
});

const { getCancellationToken, rejectRequest, resolveRequest } = axios as any;

describe('doHttpRequest()', () => {
  const testConfig = {
    body: '',
    headers: {},
    url: 'test',
    numberOfRetries: 2,
    nodeTypes: getMusterNodeTypesMap(),
    retryDelay: 100,
    requestTimeout: 1000,
    withCredentials: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WHEN the server responds with a valid JSON', () => {
    it('SHOULD return correct value', (done) => {
      doHttpRequest(testConfig).subscribe((result) => {
        expect(result).toEqual(JSON.stringify({ $type: 'value', data: { value: 'test' } }));
        done();
      });
      resolveRequest({
        config: {
          url: 'test',
        },
        status: 200,
        data: JSON.stringify({ $type: 'value', data: { value: 'test' } }),
      });
    });
  });

  describe('WHEN the server responds with an error', () => {
    it('SHOULD return an error', (done) => {
      doHttpRequest(testConfig).subscribe((result: ErrorNodeDefinition) => {
        expect(result.properties).toEqual({
          error: new Error('Network error'),
          data: {
            statusCode: 500,
            url: 'test',
          },
        });
        done();
      });
      rejectRequest({
        config: {
          url: 'test',
        },
        status: 500,
        data: JSON.stringify({ $type: 'value', data: { value: 'test' } }),
      });
    });
  });

  describe('WHEN subscribing to the request', () => {
    describe('BUT the request was cancelled before resolving', () => {
      it('SHOULD call the CancelToken.cancel', () => {
        const requestStream = doHttpRequest(testConfig);
        const callback = jest.fn();
        const subscription = requestStream.subscribe(callback);
        expect(getCancellationToken().cancel).not.toHaveBeenCalled();
        expect(axios).toHaveBeenCalledTimes(1);
        subscription.unsubscribe();
        expect(getCancellationToken().cancel).toHaveBeenCalled();
        resolveRequest({
          config: {
            url: 'test',
          },
          status: 200,
          data: JSON.stringify({ $type: 'value', data: { value: 'test' } }),
        });
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
