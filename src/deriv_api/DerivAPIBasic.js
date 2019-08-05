import './Storage';
import './SubscriptionManager';

import { first }        from 'rxjs/operators';
import { Subject }      from 'rxjs';

import Cache            from './Cache';
import CustomPromise    from './CustomPromise';
import DerivAPICalls    from './DerivAPICalls';
import {
    APIError,
    CallError,
    ConstructionError,
    ResponseError,
}                       from './errors';

/**
 * The minimum functionality provided by DerivAPI, provides direct calls to the
 * API.
 * `api.cache` is available if you want to use the cached data (see {@link Cache})
 *
 * @example
 * const apiFromOpenConnection = new DerivAPI({ connection });
 * const apiFromEndpoint = new DerivAPI({ endpoint: 'ws.binaryws.com', app_id: 1234 });
 *
 * @param {Object}     options
 * @param {WebSocket=} options.connection - A ready to use connection
 * @param {String}     options.endpoint   - API server to connect to
 * @param {Number}     options.app_id     - Application ID of the API user
 * @param {String}     options.lang       - Language of the API communication
 */
export default class DerivAPIBasic extends DerivAPICalls {
    constructor({
        connection,
        endpoint = 'blue.binaryws.com',
        app_id   = 1,
        lang     = 'EN',
    } = {}) {
        super();

        if (connection) {
            this.connection = connection;
        } else {
            this.shouldReconnect = true;
            this.connectionArgs  = {
                app_id,
                endpointUrl: getUrl(endpoint),
                lang       : lang.toUpperCase(),
            };
            this.connect();
        }

        this.connection.onopen    = this.onOpen.bind(this);
        this.connection.onclose   = this.onClose.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);

        this.lang            = lang;
        this.reqId           = 0;
        this.connected       = new CustomPromise();
        this.sanityErrors    = new Subject();
        this.cache           = new Cache(this);
        this.pendingRequests = {};
    }

    connect() {
        if (!this.connectionArgs) {
            throw new ConstructionError(
                'Connection arguments are required to create a connection.',
            );
        }

        const { endpointUrl, lang, app_id } = this.connectionArgs;

        this.connection = new WebSocket(
            `${endpointUrl.toString()}websockets/v3?l=${lang}&app_id=${app_id}`,
        );
    }

    disconnect() {
        this.shouldReconnect = false; // prevents re-connecting automatically
        this.connection.close();
    }

    async send(request) {
        const pending = new Subject();

        request.req_id = request.req_id || ++this.reqId;

        this.pendingRequests[request.req_id] = pending;

        await this.connected;

        const sendRequest = pending.pipe(first()).toPromise();

        this.connection.send(JSON.stringify(request));

        const response = await sendRequest;
        this.cache.set(request, response);

        return response;
    }

    /**
     * Subscribe and call the given callback on each response
     *
     * @example
     * await api.subscribeWithCallback({ ticks: 'R_100' }, console.log)
     *
     * @param {Object}   request  - A request object acceptable by the API
     * @param {Function} callback - A callback to call on every new response
     *
     * @returns {Promise} - Resolves to the first response or is rejected with an error
     * */
    async subscribeWithCallback(request, callback) {
        if (!callback) {
            throw new CallError('A callback is required for subscription');
        }

        const source = this.subscribe(request);

        // Ignoring the failures in observable, because we send a promise back
        source.subscribe(callback, () => {});

        return source.pipe(first()).toPromise();
    }

    /**
     * Subscribe to a given request, returns a stream of new responses,
     * Errors should be handled by the user of the stream
     *
     * @example
     * const ticks = api.subscribe({ ticks: 'R_100' });
     * ticks.subscribe(console.log) // Print every new tick
     *
     * @param {Object} request - A request object acceptable by the API
     *
     * @returns {Observable} - An RxJS Observable
     */
    subscribe(request) {
        request.subscribe = 1;

        // Ignore the promise failure, we expect the observable to handle error
        this.send(request).catch(() => {});

        return this.pendingRequests[request.req_id];
    }

    onOpen() {
        if (this.connection.readyState === 1) {
            this.connected.resolve();
        } else {
            setTimeout(this.onOpen.bind(this), 50);
        }
    }

    onMessage(msg) {
        if (!msg.data) {
            this.sanityErrors.next(
                new APIError(
                    'Something went wrong while receiving the response from API.',
                ),
            );
            return;
        }

        const response = JSON.parse(msg.data);
        const reqId    = response.req_id;

        if (reqId in this.pendingRequests) {
            if (response.error) {
                this.pendingRequests[reqId].error(new ResponseError(response));
            } else {
                this.pendingRequests[reqId].next(response);
            }
        } else {
            this.sanityErrors.next(new APIError('Extra response'));
        }
    }

    /**
     * Reconnects to the API in case of connection error, unless connection is
     * passed as an argument, in that case reconnecting should be handled in the
     * API user side.
     * */
    onClose() {
        if (this.shouldReconnect) {
            this.connect();
        }
    }
}

function getUrl(originalEndpoint) {
    if (typeof originalEndpoint !== 'string') {
        throw new ConstructionError(
            `Endpoint must be a string, passed: ${typeof originalEndpoint}`,
        );
    }

    let url;

    try {
        // eslint-disable-next-line no-unused-vars
        const [_, protocol, endpoint] = originalEndpoint.match(
            /((?:\w*:\/\/)*)(.*)/,
        );

        url = new URL(`${protocol === 'ws://' ? protocol : 'wss://'}${endpoint}`);
    } catch (e) {
        throw new ConstructionError(`Invalid URL: ${originalEndpoint}`);
    }

    return url;
}
