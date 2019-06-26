import DerivAPICalls     from './DerivAPICalls';
import CustomPromise     from './CustomPromise';
import CustomObservable  from './CustomObservable';
import { first }         from 'rxjs/operators';
import { Observable }    from 'rxjs';
import { ResponseError, APIError, ConstructionError } from './error';

export default class DerivAPI extends DerivAPICalls {
    constructor({ connection, endpoint = 'red.binaryws.com', appId = 1, lang = 'EN' } = {}) {
        super();

        if (connection) {
            this.connection = connection;
        } else {
            this.shouldReconnect = true;
            this.connectionArgs = { url: getUrl(endpoint), appId, lang: lang.toUpperCase() };
            this.connect();
        }

        this.connection.onopen    = this.onOpen.bind(this);
        this.connection.onclose   = this.onClose.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);

        this.connected = new CustomPromise();
        this.sanityErrors = new CustomObservable();
        this.pendingRequests = {};
    }

    connect() {
        if (!this.connectionArgs) {
            throw new ConstructionError('Connection arguments are required to create a connection.')
        }

        const { url, lang, appId } = this.connectionArgs;
        this.connection = new WebSocket(`${url.toString()}websockets/v3?l=${lang}&app_id=${appId}`);
    }

    disconnect() {
        this.shouldReconnect = false; // prevents re-connecting automatically
        this.connection.close();
    }

    async send(obj) {
        const pending = new CustomObservable();

        this.pendingRequests[obj.req_id] = pending;

        const connection = await this.connected;

        const sendRequest = pending.pipe(first()).toPromise();

        this.connection.send(JSON.stringify(obj));

        return sendRequest;
    }

    // await api.subscribeWithCallback({ ticks: "r_100" }, r => console.log(r))
    async subscribeWithCallback(obj, callback) {
        if (!callback) {
            throw new CallError('A callback is required for subscription');
        }

        const pendingSend = this.send({ ...obj, subscribe: 1 });

        this.pendingRequests[obj.req_id].subscribe(callback)

        return pendingSend;
    }

    subscribe(obj) {
        this.send({ ...obj, subscribe: 1 });

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
            this.sanityErrors.publish(new APIError('Something went wrong while receiving the response from API.'))
            return;
        }

        const response = JSON.parse(msg.data);

        const reqId = response.req_id;

        if ( reqId in this.pendingRequests ) {
            if (response.error) {
                this.pendingRequests[reqId].error(new ResponseError(response));
            } else {
                this.pendingRequests[reqId].publish(response);
            }
        } else {
            this.sanityErrors.publish(new APIError('Extra response'))
        }
    }

    onClose() {
        if (this.shouldReconnect) {
            this.connect();
        }
    }
}

function getUrl(originalEndpoint) {
    if (typeof originalEndpoint !== 'string') {
        throw new ConstructionError(`Endpoint must be a string, passed: ${typeof originalEndpoint}`)
    }

    let url;

    try {
        const [_, protocol, endpoint] = originalEndpoint.match(/((?:\w*:\/\/)*)(.*)/)
        url = new URL(`${protocol === 'ws://' ? protocol : 'wss://'}${endpoint}`);
    } catch(e) {
        throw new ConstructionError(`Invalid URL: ${originalEndpoint}`)
    }

    return url;
}

