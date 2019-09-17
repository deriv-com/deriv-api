import DerivAPIBasic from '../DerivAPIBasic';

let api;
global.WebSocket    = jest.fn();
const { WebSocket } = global;

test('Is websocket instance created', () => {
    expect(api.connection).toBeInstanceOf(WebSocket);
    expect(WebSocket).toHaveBeenCalledWith('ws://localhost/websockets/v3?app_id=4000&l=FR&brand=deriv');
});

test('API can send a request', async () => {
    const expected_request  = { ping: 1,      req_id: 1 };
    const expected_response = { ping: 'pong', req_id: 1 };

    // Make a call to onmessage immediately after send is called
    WebSocket.prototype.send = jest.fn(() => api.connection.onmessage({
        data: JSON.stringify(expected_response),
    }));

    const response = await api.ping();

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
    WebSocket.prototype.close = jest.fn();

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
