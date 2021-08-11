import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;

const middleware = {
    sendWillBeCalled: jest.fn(),
    sendIsCalled    : jest.fn(),
};

const request = { ping: 1 };

test('Expect middleware functions to be called on send', async () => {
    api.send(request);
    expect(middleware.sendWillBeCalled).toBeCalledWith({ args: [request] });
    expect(middleware.sendIsCalled)
        .toBeCalledWith({ response_promise: new Promise(() => {}), args: [request] });
});

test('Expect sendIsCalled to be called if sendWillBeCalled returns undefined', async () => {
    middleware.sendWillBeCalled = () => 1;
    middleware.sendIsCalled     = jest.fn();

    const returned_value = api.send(request);
    expect(returned_value).toEqual(Promise.resolve(1));
    expect(middleware.sendIsCalled).not.toBeCalled();
});

beforeAll(() => {
    connection = new TestWebSocket({
        ping: 'pong',
    });

    api = new DerivAPIBasic({ connection, middleware });
});
