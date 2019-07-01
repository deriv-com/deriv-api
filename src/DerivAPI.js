import { first }        from 'rxjs/operators';
import DerivAPICalls    from './DerivAPICalls';
import Underlying       from './DerivAPI/Underlying';
import CustomPromise    from './lib/CustomPromise';
import CustomObservable from './lib/CustomObservable';
import Cache            from './Cache';
import {
    APIError,
    CallError,
    ConstructionError,
    ResponseError,
}                       from './lib/error';
import { getUrl }       from './lib/utils';

export default class DerivAPI extends DerivAPICalls {
    constructor({
        connection,
        endpoint = 'blue.binaryws.com',
        appId    = 1,
        lang     = 'EN',
    } = {}) {
        super();

        if (connection) {
            this.connection = connection;
        } else {
            this.shouldReconnect = true;
            this.connectionArgs  = {
                appId,
                endpointUrl: getUrl(endpoint),
                lang       : lang.toUpperCase(),
            };
            this.connect();
        }

        this.connection.onopen    = this.onOpen.bind(this);
        this.connection.onclose   = this.onClose.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);

        this.reqId           = 0;
        this.connected       = new CustomPromise();
        this.sanityErrors    = new CustomObservable();
        this.cache           = new Cache(this);
        this.pendingRequests = {};
    }

    connect() {
        if (!this.connectionArgs) {
            throw new ConstructionError(
                'Connection arguments are required to create a connection.',
            );
        }

        const { endpointUrl, lang, appId } = this.connectionArgs;

        this.connection = new WebSocket(
            `${endpointUrl.toString()}websockets/v3?l=${lang}&app_id=${appId}`,
        );
    }

    disconnect() {
        this.shouldReconnect = false; // prevents re-connecting automatically
        this.connection.close();
    }

    async send(obj) {
        const pending = new CustomObservable();

        obj.req_id = obj.req_id || ++this.reqId;

        this.pendingRequests[obj.req_id] = pending;

        await this.connected;

        const sendRequest = pending.pipe(first()).toPromise();

        this.connection.send(JSON.stringify(obj));

        return sendRequest;
    }

    // await api.subscribeWithCallback({ ticks: "r_100" }, r => console.log(r))
    async subscribeWithCallback(obj, callback) {
        if (!callback) {
            throw new CallError('A callback is required for subscription');
        }

        const source = this.subscribe(obj);

        // Ignoring the failures in observable, because we send a promise back
        source.subscribe(callback, () => {});

        return source.pipe(first()).toPromise();
    }

    subscribe(obj) {
        obj.subscribe = 1;

        // Ignore the promise failure, we expect the observable to handle error
        this.send(obj).catch(() => {});

        return this.pendingRequests[obj.req_id];
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
            this.sanityErrors.publish(
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
                this.pendingRequests[reqId].publish(response);
            }
        } else {
            this.sanityErrors.publish(new APIError('Extra response'));
        }
    }

    onClose() {
        if (this.shouldReconnect) {
            this.connect();
        }
    }

    async underlying(symbol) {
        const activeSymbols = (await this.cache.activeSymbols({ active_symbols: 'full' })).active_symbols;

        return new Underlying(activeSymbols.find(info => info.symbol === symbol), this);
    }
}
