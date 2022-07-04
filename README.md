# DerivAPI

Async Websocket API for deriv-app

Code Coverage: [![codecov](https://codecov.io/gh/binary-com/deriv-api/branch/master/graph/badge.svg)](https://codecov.io/gh/binary-com/deriv-api)

### Requirement:
   
Node.js (v12.18.0 or higher is recommended)

# Installation

## Installing Deriv API Library

We need to install the Deriv API library if we want to connect to Deriv's websocket.
#### NPM

```
npm install @deriv/deriv-api
```

#### yarn

```
yarn add @deriv/deriv-api
```
## Installing Websocket (ws) library

In order to make a websocket connection, we need the websocket (ws) library.
#### NPM

```
npm install ws
```

#### yarn

```
yarn add ws
```

# Usage

## Basic library

The basic library is a lighter version of the Deriv API, suitable for apps that
want to directly deal with API calls.

It can either be imported as a separate module (to reduce the final bundle size)
or if the `DerivAPI` library is already imported, can be accessed using `api.basic`.

```js
const WebSocket = require('ws');
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI');

// app_id 1089 is for testing, create your own app_id and use it here.
// go to api.deriv.com to register your own app.
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
const api        = new DerivAPI({ connection });
const basic = api.basic;

basic.ping().then(console.log);
```

## ES6 modules

#### Basic API

```js
// Smaller bundle size, dealing only with the low-level library
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
import WebSocket from 'ws';

// app_id 1089 is for testing, create your own app_id and use it here.
// go to api.deriv.com to register your own app.
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
const api        = new DerivAPIBasic({ connection });

api.ping().then(console.log);
```

## CommonJS modules

#### Basic API

```js
// Smaller bundle size, dealing only with the low-level library
const WebSocket = require('ws');
const DerivAPIBasic = require('@deriv/deriv-api/dist/DerivAPIBasic');

// app_id 1089 is for testing, create your own app_id and use it here.
// go to api.deriv.com to register your own app.
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
const api        = new DerivAPIBasic({ connection });

api.ping().then(console.log);
```

## Using the HTML script tag

#### Basic API

```html
<script src="https://unpkg.com/@deriv/deriv-api/dist/DerivAPIBasic.js"></script>
<script>
    const api = new DerivAPIBasic({ 
        endpoint: 'ws.binaryws.com',
        app_id: 1089 /* 1089 is a default test app_id, replace with your own app_id */,
        lang: 'EN' 
    });
    
    api.ping().then(console.log);
</script>
```

## Creating a WebSocket connection

There are two ways to establish a connection:

1. Use a previously opened connection:
    ```js
    const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=YOUR_APP_ID');
    const api        = new DerivAPI({ connection });
    ```

2. Pass the arguments needed to create a connection:
    ```js
    const api = new DerivAPI({ endpoint: 'ws.binaryws.com', app_id: /* your app_id */, lang: 'EN' });
    ```

# Documentation

#### Wiki

There is a short tutorial about how to use Deriv API in the [wiki page](https://github.com/binary-com/deriv-api/wiki).

#### API reference

The complete API reference is hosted [here](https://binary-com.github.io/deriv-api/)

The above reference in one page: [DerivAPI reference](docs/DerivAPI.md)

# Development

```
git clone https://github.com/binary-com/deriv-api
cd deriv-api
npm install
```

#### To run the tests

```
npm test
```

#### Run tests automatically on source code edits

```
npm run devel
```

#### Run linter

```
npm run syntax
```

#### Run all tests (lint + js tests)

```
npm run test_all
```

#### Prettify the code (done automatically on commit)

```
npm run prettify
```

#### Generate documentations

```
npm run docs
```

#### Regenerate docs automatically on source code edit

Needs `inotify` to work.

```
npm run devel_docs
```

#### Serve docs on localhost and update on source code changes

```
npm run serve_docs
```

#### Generate html version of the docs and publish it to gh-pages

```
npm run gh-pages
```

#### Build the package

```
npm run build
```

#### Run examples

```
DERIV_TOKEN=YourTokenHere npm run examples
```
