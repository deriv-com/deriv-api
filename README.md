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
    const api        = new DerivAPI({ connection });
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
      const firstTick = await sourse.pipe(first()).toPromise() // RxJS 6
      ```

3. There are abstractions such as `account`, `contract`, `underlying`, etc.

    e.g. **`underlying:`**

    - To initialise with default values:
      ```js
      const r100Instance = await api.underlying('R_100');
      // access underlying information according to active_symbols:
      console.log(r100Instance.symbol);                 // R_100
      console.log(r100Instance.display_name);           // Volatility 100 Index
      console.log(r100Instance.market);                 // volidx
      console.log(r100Instance.market_display_name);    // Volatility Indices
      console.log(r100Instance.submarket);              // random_index
      console.log(r100Instance.submarket_display_name); // Continuous Indices
      console.log(r100Instance.pip);                    // 0.01
      ...
      ```

    - Retrieve the latest 10 ticks:
      ```js
      const r100History = await r100Instance.ticksHistory({ end: 'latest', count: 10 });
      ```

    - Retrieve the latest 10 ticks and subscribe:
      ```js
      r100Instance.ticksHistorySubscribe({ end: 'latest', count: 10 }, cbTicks);
      ```

    - Trading Times of the symbol:
      ```js
      const r100TradingTimesInfo = await r100Instance.tradingTimes(); // today
      const r100TradingTimesInfo = await r100Instance.tradingTimes('2019-06-28');
      ```

    - Asset Index of the symbol:
      ```js
      const r100AssetIndexInfo = await r100Instance.assetIndex(); // default values
      const r100AssetIndexInfo = await r100Instance.assetIndex({ landing_company: 'svg' });
      ```

    - Available contracts of the symbol:
      ```js
      const r100ContractsInfo = await r100Instance.contractsFor(); // default values
      const r100ContractsInfo = await r100Instance.contractsFor({
          landing_company: 'svg',
          product_type   : 'basic',
          currency       : 'USD',
      });
      ```
