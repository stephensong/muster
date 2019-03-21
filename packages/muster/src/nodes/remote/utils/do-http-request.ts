import { Observable, ObservableLike, Observer } from '@dws/muster-observable';
import axios, { AxiosPromise, AxiosResponse, CancelTokenSource } from 'axios';
import { error, ErrorNodeDefinition } from '../../graph/error';

export interface HttpRequestConfiguration {
  body: string;
  headers: { [key: string]: string };
  numberOfRetries?: number;
  retryDelay?: number;
  requestTimeout?: number;
  url: string;
  withCredentials: boolean;
}

const CancelToken = axios.CancelToken;

export function doHttpRequest(
  config: HttpRequestConfiguration,
): ObservableLike<string | ErrorNodeDefinition> {
  return new Observable((observer: Observer<string | ErrorNodeDefinition>) => {
    const cancellationToken = CancelToken.source();
    let cancelled = false;
    // This returns promise but we ignore it...
    startRequestRetryLoop(config, observer, cancellationToken);
    return () => {
      if (cancelled) return;
      cancelled = true;
      cancellationToken.cancel();
    };
  });
}

async function startRequestRetryLoop(
  config: HttpRequestConfiguration,
  observer: Observer<string | ErrorNodeDefinition>,
  cancellationToken: CancelTokenSource,
) {
  let remainingRetries = config.numberOfRetries || 0;
  do {
    const response = await doSingleHttpRequest(config, cancellationToken);
    if (!response.hasTimedOut) {
      observer.next(response.body);
      return;
    }
    remainingRetries--; // tslint:disable-line:no-increment-decrement
    if (remainingRetries > 0 && config.retryDelay) {
      await new Promise((res) => setTimeout(res, config.retryDelay));
    }
  } while (remainingRetries > 0);
  observer.next(error(`Could not complete the HTTP request: A request has timed out.`));
}

function doSingleHttpRequest(
  config: HttpRequestConfiguration,
  cancellationToken: CancelTokenSource,
) {
  return startRequest(config, cancellationToken)
    .then((response) => {
      if (response.status === 0) {
        return { hasTimedOut: true, body: error('A request has timed out') };
      }
      return { hasTimedOut: false, body: processResponse(config, response) };
    })
    .catch((ex) => {
      if (axios.isCancel(ex)) {
        return { hasTimedOut: false, body: error('The request was aborted.') };
      }
      return { hasTimedOut: false, body: remoteError('Network error', ex) };
    });
}

function startRequest(
  config: HttpRequestConfiguration,
  cancellationToken: CancelTokenSource,
): AxiosPromise {
  return axios({
    cancelToken: cancellationToken.token,
    method: 'post',
    url: config.url,
    data: config.body,
    responseType: 'text',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function processResponse(
  config: HttpRequestConfiguration,
  res: AxiosResponse<any>,
): string | ErrorNodeDefinition {
  const data = typeof res.data === 'object' ? JSON.stringify(res.data) : res.data;
  if (res.status < 200 || res.status > 299) return remoteError(data, res);
  if (!data) return remoteError('Invalid remote server response', res);
  return data;
}

function remoteError(message: string, response: AxiosResponse<any>): ErrorNodeDefinition {
  return error(message, {
    data: {
      url: response.config.url,
      statusCode: response.status,
    },
  });
}
