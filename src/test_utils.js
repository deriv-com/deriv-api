export class TestWebSocket { // eslint-disable-line import/prefer-default-export
    constructor(acceptable_responses) {
        this.method_to_req_id     = {};
        this.acceptable_responses = acceptable_responses;

        setTimeout(() => {
            this.readyState = 1;
            this.onopen();
        }, 0);
    }

    send(msg) {
        const request    = JSON.parse(msg);
        const { req_id } = request;

        Object.keys(this.acceptable_responses).forEach((method) => {
            if (method in request) {
                if (method === 'ticks_history' && request.subscribe) {
                    if (request.style === 'ticks') {
                        this.method_to_req_id.tick = req_id;
                    } else {
                        this.method_to_req_id.ohlc = req_id;
                    }
                }
                this.method_to_req_id[method] = req_id;

                this.receive(method, this.acceptable_responses[method]);
            }
        });
    }

    replaceResponse(method, payload) {
        this.acceptable_responses[method] = payload;
    }

    receive(method, payload) {
        let type = method;

        if (method === 'ticks_history') {
            if (payload instanceof Array) {
                type = 'candles';
            } else {
                type = 'history';
            }
        }

        if ('error' in payload) {
            this.onmessage({
                data: JSON.stringify({
                    error   : payload,
                    msg_type: type,
                    req_id  : this.method_to_req_id[method],
                }),
            });
        } else {
            this.onmessage({
                data: JSON.stringify({
                    [type]  : payload,
                    msg_type: type,
                    req_id  : this.method_to_req_id[method],
                }),
            });
        }
    }

    receiveLater(...args) {
        setTimeout(() => {
            this.receive(...args);
        }, 0);
    }
}
