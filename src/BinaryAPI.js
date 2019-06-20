import BinaryAPICalls from './BinaryAPICalls.js';

export default class BinaryAPI extends BinaryAPICalls {
    constructor({connection, endpoint = 'ws.binaryws.com', appId = 1, lang = 'EN'}) {
        this.connection = connection ?
            connection :
            WebSocket(`wss:\/\/${endpoint}/v3/websocket?l=${lang}&app_id=${appId}`)
    }
}
