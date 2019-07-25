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
                this.method_to_req_id[method] = req_id;
                this.receive(method, this.acceptable_responses[method]);
            }
        });
    }

    replaceResponse(method, payload) {
        this.acceptable_responses[method] = payload;
    }

    receive(method, payload) {
        if ('error' in payload) {
            this.onmessage({
                data: JSON.stringify({
                    error   : payload,
                    msg_type: method,
                    req_id  : this.method_to_req_id[method],
                }),
            });
        } else {
            this.onmessage({
                data: JSON.stringify({
                    [method]: payload,
                    msg_type: method,
                    req_id  : this.method_to_req_id[method],
                }),
            });
        }
    }
}
