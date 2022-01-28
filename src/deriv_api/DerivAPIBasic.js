import {
    first,
    filter,
    share,
} from 'rxjs/operators';
import { Subject }         from 'rxjs';

import Cache               from './Cache';
import CustomPromise       from './CustomPromise';
import DerivAPICalls       from './DerivAPICalls';
import InMemory            from './InMemory';
import SubscriptionManager from './SubscriptionManager';
import {
    APIError,
    ConstructionError,
} from './errors';

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
 * @param {String}     options.brand      - Brand name
 * @param {Object}     options.middleware - A middleware to call on certain API actions
 *
 * @property {Observable} events
 * @property {Cache} cache - Temporary cache default to @link{InMemory}
 * @property {Cache} storage - If specified, uses a more presistent cache (local storage, etc.)
 */
export default class DerivAPIBasic extends DerivAPICalls {
    constructor({
        storage,
        app_id,
        connection,
        cache      = new InMemory(),
        endpoint   = 'frontend.binaryws.com',
        lang       = 'EN',
        brand      = '',
        middleware = {},
    } = {}) {
        super();

        this.events = new Subject();

        if (connection) {
            this.connection = connection;
        } else {
            if (!app_id) throw Error('An app_id is required to connect to the API');

            this.shouldReconnect = true;
            this.connectionArgs  = {
                app_id,
                endpointUrl: getUrl(endpoint),
                lang       : lang.toUpperCase(),
                brand      : brand.toLowerCase(),
            };
            this.connect();
        }

        this.lang                  = lang;
        this.reqId                 = 0;
        this.connected             = new CustomPromise();
        this.sanityErrors          = new Subject();
        this.middleware            = middleware;
        this.pendingRequests       = {};
        this.expect_response_types = {};
        this.subscription_manager  = new SubscriptionManager(this);
        this.reconnect_timeout     = false;
        this.keep_alive_interval   = false;

        if (storage) {
            this.storage = new Cache(this, storage);
        }

        // If we have the storage look that one up
        this.cache = new Cache(this.storage ? this.storage : this, cache);

        this.connectionHandlers();
    }

    connectionHandlers() {
        this.connection.onopen    = this.openHandler.bind(this);
        this.connection.onclose   = this.closeHandler.bind(this);
        this.connection.onmessage = this.messageHandler.bind(this);
        this.connection.onerror   = this.errorHandler.bind(this);
    }

    connect() {
        if (!this.connectionArgs) {
            throw new ConstructionError(
                'Connection arguments are required to create a connection.',
            );
        }

        this.events.next({
            name: 'connect',
        });

        const {
            endpointUrl,
            lang,
            app_id,
            brand,
        } = this.connectionArgs;

        this.connection = new WebSocket(
            `${endpointUrl.toString()}websockets/v3?app_id=${app_id}&l=${lang}&brand=${brand}`,
        );
    }

    disconnect() {
        this.shouldReconnect = false; // prevents re-connecting automatically
        this.connection.close();
    }

    isConnectionClosed() {
        return this.connection.readyState === 2 || this.connection.readyState === 3;
    }

    sendAndGetSource(request) {
        const pending = new Subject();

        request.req_id = request.req_id || ++this.reqId;

        this.pendingRequests[request.req_id] = pending;

        this.connected
            .then(() => {
                if (this.isConnectionClosed()) return;

                this.connection.send(JSON.stringify(request));
            })
            .catch((e) => pending.error(e));

        return pending;
    }

    async send(...args) {
        const send_will_be_called = this.callMiddleware('sendWillBeCalled', { args });
        if (send_will_be_called) return send_will_be_called;

        const [request] = args;

        this.events.next({
            name: 'send',
            data: request,
        });

        this.deleteFromExpectResponse(request);

        const response_promise = this.sendAndGetSource(request).pipe(first()).toPromise();

        response_promise.then((response) => {
            this.cache.set(request, response);
            if (this.storage) {
                this.storage.set(request, response);
            }
        }, () => {}); // Ignore errors here

        const send_is_called = this.callMiddleware('sendIsCalled', { response_promise, args });
        if (send_is_called) return send_is_called;

        return response_promise;
    }

    callMiddleware(name, args) {
        if (!(name in this.middleware)) return undefined;

        return this.middleware[name](args);
    }

    subscribe(request) {
        return this.subscription_manager.subscribe(request);
    }

    async forget(id) {
        return this.subscription_manager.forget(id);
    }

    async forgetAll(...types) {
        return this.subscription_manager.forgetAll(...types);
    }

    keepAlivePing() {
        this.ping({ ping: 1 });
        this.reconnect_timeout = setTimeout(this.reconnect.bind(this), 5000);
    }

    pong() {
        if (this.reconnect_timeout) {
            clearTimeout(this.reconnect_timeout);
            this.reconnect_timeout = false;
        }
    }

    openHandler() {
        this.events.next({
            name: 'open',
        });
        if (this.shouldReconnect) {
            this.keep_alive_interval = setInterval(this.keepAlivePing.bind(this), 30000);
        }
        if (this.connection.readyState === 1) {
            this.connected.resolve();
        } else {
            setTimeout(this.openHandler.bind(this), 50);
        }
    }

    messageHandler(msg) {
        if (!msg.data) {
            this.sanityErrors.next(
                new APIError(
                    'Something went wrong while receiving the response from API.',
                ),
            );
            return;
        }
        const response = JSON.parse(msg.data);

        if (this.reconnect_timeout && response.ping === 'pong') {
            this.pong();
        }

        this.events.next({
            name: 'message',
            data: response,
        });

        const reqId = response.req_id;

        if (reqId in this.pendingRequests) {
            const expect_response = this.expect_response_types[response.msg_type];
            if (expect_response && expect_response.isPending()) {
                expect_response.resolve(response);
            }

            const request = response.echo_req;
            // When one of the child subscriptions of `proposal_open_contract` has an error in the response,
            // it should be handled in the callback of consumer instead. Calling `error()` with parent subscription
            // will mark the parent subscription as complete and all child subscriptions will be forgotten.
            const is_parent_subscription = request && request.proposal_open_contract
                                            && !request.contract_id;

            if (response.error && !is_parent_subscription) {
                this.pendingRequests[reqId].error(response);
            } else if (this.pendingRequests[reqId].isStopped && response.subscription) {
                // Source is already marked as completed. In this case we should
                // send a forget request with the subscription id and ignore the response received.
                const { id } = response.subscription;
                this.forget(id);
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
    closeHandler() {
        this.events.next({
            name: 'close',
        });
        if (this.shouldReconnect) {
            this.events.next({
                name: 'reconnecting',
            });

            this.reconnect();
        }
    }

    /**
     * Clears previous connection keeplive ping timeout and connect & assign the handles
     */
    reconnect() {
        if (this.shouldReconnect) {
            if (this.keep_alive_interval) {
                clearInterval(this.keep_alive_interval);
                this.keep_alive_interval = false;
            }
            this.pong(); // clear all previous timeout
            this.connect();
            this.connectionHandlers();
        }
    }

    errorHandler() {
        this.sanityErrors.next(
            new APIError(
                'Something went wrong while receiving the response from API.',
            ),
        );
    }

    /**
     * @returns {Observable} for close events
     */
    onClose() {
        return this.events.pipe(filter((e) => e.name === 'close'), share());
    }

    /**
     * @returns {Observable} for open events
     */
    onOpen() {
        return this.events.pipe(filter((e) => e.name === 'open'), share());
    }

    /**
     * @returns {Observable} for new messages
     */
    onMessage() {
        return this.events.pipe(filter((e) => e.name === 'message'), share());
    }

    /**
     * @param {String} types Expect these types to be received by the API
     *
     * @returns {Promise<Object>|Promise<Array>} Resolves to a single response or an array
     */
    async expectResponse(...types) {
        types.forEach((type) => {
            if (!(type in this.expect_response_types)) {
                this.expect_response_types[type] = transformUndefinedToPromise(
                    this.cache.getByMsgType(type).then((value) => {
                        if (!value && this.storage) return this.storage.getByMsgType(type);
                        return value;
                    }),
                );
            }
        });

        // expect on a single response returns a single response, not a list
        if (types.length === 1) return this.expect_response_types[types[0]];

        return Promise.all(types.map((type) => this.expect_response_types[type]));
    }

    deleteFromExpectResponse(request) {
        const response_type = Object
            .keys(this.expect_response_types)
            .find((type) => type in request);
        if (this.expect_response_types[response_type]
            && !this.expect_response_types[response_type].isPending()) {
            delete this.expect_response_types[response_type];
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

function transformUndefinedToPromise(promise) {
    return CustomPromise.wrap(promise.then((value) => {
        if (!value) return new CustomPromise();

        return value;
    }));
}
