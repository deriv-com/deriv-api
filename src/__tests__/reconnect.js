import ws        from 'ws';
import DerivAPI  from '../DerivAPI'

let api;
global.WebSocket = jest.fn()
const WebSocket = global.WebSocket;

beforeAll(() => {
    WebSocket.prototype.close = jest.fn()
    api = new DerivAPI({ appId: 4000, endpoint: 'ws://localhost', lang: 'fr' });
    // Set the connection to ready state with a delay
    setTimeout(() => {
        WebSocket.prototype.readyState = 1
    }, 1000)
    // Make an open connection
    api.connection.onopen()
});

afterAll(() => {
    api.disconnect();
})

test('Is websocket instance created', () => {
    expect(api.connection).toBeInstanceOf(WebSocket)
    expect(WebSocket.mock.calls[0][0]).toBe('ws://localhost/websockets/v3?l=FR&app_id=4000')
})

test('API can send a request', async () => {
    const expectedRequest  = { ping: 1, req_id: 1 };
    const expectedResponse = { ping: 'pong', req_id: 1 };

    // Make a call to onmessage immediately after send is called
    WebSocket.prototype.send = jest.fn(() => api.connection.onmessage({data: JSON.stringify(expectedResponse)}))

    const response = await api.ping()

    expect(response).toEqual(expectedResponse)
    expect(WebSocket.prototype.send.mock.calls[0][0]).toBe(JSON.stringify(expectedRequest))
})

test('API auto reconnect', async () => {
    api.connection.onclose();
    expect(WebSocket.mock.calls.length).toBe(2)
})

test('API does not reconnect if connection is passed', async () => {
    const connection = new WebSocket('ws://localhost')

    const apiWithConnection = new DerivAPI({ connection })

    apiWithConnection.connection.onclose()

    // If reconnect was issued, 4 calls were seen
    expect(WebSocket.mock.calls.length).toBe(3)
})
