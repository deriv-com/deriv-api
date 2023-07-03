import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;

const middleware = {
    sendWillBeCalled      : jest.fn(),
    sendIsCalled          : jest.fn(),
    requestDataTransformer: jest.fn(),
};

const request = { ping: 1 };

test('Expect middleware functions to be called on send', async () => {
    api.send(request);
    expect(middleware.sendWillBeCalled).toBeCalledWith({ args: [request] });
    expect(middleware.requestDataTransformer).toBeCalledWith(request);
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

test('Expect requestDataTransformer to modify requests', async () => {
    middleware.requestDataTransformer = (req) => ({ ...req, modified: true });

    const modified_request = middleware.requestDataTransformer(request);
    expect(modified_request).toEqual({ ping: 1, modified: true, req_id: 1 });
});

test('Expect request data to be unchanged if requestDataTransformer is not defined', async () => {
    delete middleware.requestDataTransformer;

    const returned_value = api.send(request);
    expect(returned_value).toEqual(Promise.resolve(1));
});

beforeAll(() => {
    connection = new TestWebSocket({
        ping: 'pong',
    });

    api = new DerivAPIBasic({ connection, middleware });
});
