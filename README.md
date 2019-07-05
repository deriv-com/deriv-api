# deriv-api

Async Websocket API for deriv.app

Code Coverage: [![codecov](https://codecov.io/gh/binary-com/deriv-api/branch/master/graph/badge.svg)](https://codecov.io/gh/binary-com/deriv-api)

# Usage

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

For more detailed examples see the [wiki](https://github.com/binary-com/deriv-api/wiki)
See also: [DerivAPI reference](docs/DerivAPI.md)

# Development

```
npm install
```

## To run the tests

```
npm test
```

## Run tests automatically on source code edits

```
npm run devel
```

## Run linter

```
npm run syntax
```

## Run all tests (lint + js tests)

```
npm run test_all
```

## Prettify the code (done automatically on commit)

```
npm run prettify
```

## Generate documentations

```
npm run docs
```

## Regenerate docs automatically on source code edit

```
npm run devel_docs
```


