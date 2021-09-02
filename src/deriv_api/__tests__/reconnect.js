import WebSocket     from 'isomorphic-ws';

import DerivAPIBasic from '../DerivAPIBasic';

let api;
jest.mock('isomorphic-ws');
test('Is websocket instance created', () => {
    expect(api.connection).toBeInstanceOf(WebSocket);
    expect(WebSocket).toHaveBeenCalledWith('ws://localhost/websockets/v3?app_id=4000&l=FR&brand=deriv');
});

let expected_response;
test('API can send a request', async () => {
    const expected_request = { ping: 1,      req_id: 1 };
    expected_response      = { ping: 'pong', req_id: 1 };
    const response         = await api.ping();

    expect(response).toEqual(expected_response);
    expect(WebSocket.prototype.send).toHaveBeenCalledWith(JSON.stringify(expected_request));
});

test('API auto reconnect', async () => {
    api.connection.onclose();
    expect(WebSocket).toHaveBeenCalledTimes(2);
});

test('API does not reconnect if connection is passed', async () => {
    const connection = new WebSocket('ws://localhost');

    const api_with_connection = new DerivAPIBasic({ connection });

    api_with_connection.connection.onclose();

    // If reconnect was issued, 4 calls were seen
    expect(WebSocket).toHaveBeenCalledTimes(3);
});

beforeAll(() => {
    // jest.spyOn(WebSocket.prototype, 'close').mockImplementation(jest.fn());
    WebSocket.prototype.close = jest.fn();
    // Make a call to onmessage immediately after send is called
    WebSocket.prototype.send = jest.fn(() => api.connection.onmessage({
        data: JSON.stringify(expected_response),
    }));

    api = new DerivAPIBasic({
        app_id  : 4000,
        endpoint: 'ws://localhost',
        lang    : 'fr',
        brand   : 'deriv',
    });

    // Set the connection to ready state with a delay
    setTimeout(() => {
        WebSocket.prototype.readyState = 1;
    }, 1000);

    // Make an open connection
    api.connection.onopen();
});
