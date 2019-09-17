export class TestWebSocket { // eslint-disable-line import/prefer-default-export
    constructor(acceptable_responses, delay) {
        this.method_to_req_id     = {};
        this.acceptable_responses = acceptable_responses;
        this.delay                = delay;
        this.req_id_to_subs_id    = {};

        setTimeout(() => {
            this.readyState = 1;
            this.onopen();
        }, 0);
    }

    send(msg) {
        const request               = JSON.parse(msg);
        const { req_id, subscribe } = request;

        if (subscribe) {
            this.req_id_to_subs_id[req_id] = Math.random();
        }

        Object.keys(this.acceptable_responses).forEach((method) => {
            if (method in request) {
                if (method === 'ticks_history' && request.subscribe) {
                    if (request.style === 'ticks') {
                        this.method_to_req_id.tick = req_id;
                    } else {
                        this.method_to_req_id.ohlc = req_id;
                    }
                } else if (method === 'ticks') {
                    this.method_to_req_id.tick = req_id;
                }
                this.method_to_req_id[method] = req_id;

                if (this.delay) {
                    this.receiveDelay(method, this.acceptable_responses[method], this.delay);
                } else {
                    this.receive(method, this.acceptable_responses[method]);
                }
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

        const req_id       = this.method_to_req_id[method];
        const subscription = req_id in this.req_id_to_subs_id
            ? { id: this.req_id_to_subs_id[req_id] }
            : undefined;
        if (payload instanceof Object && 'error' in payload) {
            this.onmessage({
                data: JSON.stringify({
                    error   : payload,
                    msg_type: type,
                    req_id,
                }),
            });
        } else {
            this.onmessage({
                data: JSON.stringify({
                    [type]  : payload,
                    msg_type: type,
                    subscription,
                    req_id,
                }),
            });
        }
    }

    receiveDelay(method, payload, delay) {
        setTimeout(() => {
            this.receive(method, payload);
        }, delay);
    }

    receiveLater(...args) {
        this.receiveDelay(...args, 0);
    }
}
