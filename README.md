# deriv-api

Async Websocket API for deriv.app

Code Coverage: [![codecov](https://codecov.io/gh/binary-com/deriv-api/branch/master/graph/badge.svg)](https://codecov.io/gh/binary-com/deriv-api)

## To install dependencies

```
npm install
```

## To run the tests

```
npm test
```

## How to use Deriv API

### Start a new connection

There are two ways to establish a connection:

1. Use a previously opened connection:
    ```js
    import DerivAPI from 'DerivAPI';

    const connection = new WebSocket('ws://...');
    const api        = new DerivAPI(connection);
    ```

2. Pass the arguments needed to create a connection:
    ```js
    import DerivAPI from 'DerivAPI';

    const api = new DerivAPI({ endpoint: 'ws://...', appId: 1003, lang: 'EN' });
    ```

### Making a request

1. **Normal requests** return a promise:
    ```js
    const ping = await api.ping();
    console.log(ping.ping); // pong
    ```

2. **Streaming calls:** There are two ways to subscribe to a stream.

    2.1. Using a callback:

      ```js
      const cbTicks = (response) => { console.log('Current tick is: %s', response.tick.quote); };
      const ticks   = api.subscribeWithCallback(
          { ticks: 'R_100' },
          cbTicks,
      );
      ```

    2.2. As an observer:

      ```js
      const source  = api.subscribe({ ticks: 'R_100' });
      const cbTicks = (response) => { console.log('Current tick is: %s', response.tick.quote); };
      source.subscribe(cbTicks);
      ```
