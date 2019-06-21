import BinaryAPICalls from './BinaryAPICalls';
import CustomPromise  from './CustomPromise';

export default class BinaryAPI extends BinaryAPICalls {
    constructor({ connection, endpoint = 'red.binaryws.com', appId = 1, lang = 'EN' } = {}) {
        super();

        if (connection) {
            this.connection = connection;
        } else {
            this.shouldReconnect = true;
            this.connectionArgs = { endpoint, appId, lang };
            this.connect();
        }

        this.connection.onopen    = this.onOpen.bind(this);
        this.connection.onclose   = this.onClose.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);

        this.connected = new CustomPromise();
        this.pendingRequests = {};
    }

    connect() {
        if (!this.connectionArgs) {
            throw new Error('Connection arguments are required to create a connection.');
        }

        const { endpoint, lang, appId } = this.connectionArgs;
        this.connection = new WebSocket(`wss:\/\/${endpoint}/websockets/v3?l=${lang}&app_id=${appId}`);
    }

    disconnect() {
        this.shouldReconnect = false; // prevents re-connecting automatically
        this.connection.close();
    }

    async send(request) {
        await this.connected;

        this.connection.send(JSON.stringify(request));

        const pending = new CustomPromise();
        this.pendingRequests[request.req_id] = pending;
        return pending;
    }

    onOpen() {
        if (this.connection.readyState === 1) {
            this.connected.resolve();
        } else {
            setTimeout(this.onOpen, 50);
        }
    }

    onMessage(msg) {
        if (!msg.data) {
            throw new Error('Something went wrong while receiving the response from API.');
        }

        const response = JSON.parse(msg.data);
        this.pendingRequests[response.req_id].resolve(response);
        delete this.pendingRequests[response.req_id];
    }

    onClose() {
        if (this.shouldReconnect) {
            this.connect();
        }
    }
}
