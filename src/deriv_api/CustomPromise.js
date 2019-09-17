export default class CustomPromise extends Promise {
    constructor(cb = () => {}) {
        let resolve; let
            reject;

        super((parentResolve, parentReject) => {
            resolve = parentResolve;
            reject  = parentReject;
        });

        cb(resolve, reject);

        this.resolveCallback = resolve;
        this.rejectCallback  = reject;

        this.state = 'pending';
    }

    static wrap(promise) {
        if (promise instanceof this) return promise;

        const custom_promise = new this();

        promise.then(
            custom_promise.resolve.bind(custom_promise),
            custom_promise.reject.bind(custom_promise),
        );

        return custom_promise;
    }

    resolve(data) {
        this.resolveCallback(data);

        this.state = 'resolved';

        return this;
    }

    reject(error) {
        this.rejectCallback(error);

        this.state = 'rejected';

        return this;
    }

    isPending() {
        return this.state === 'pending';
    }

    isRejected() {
        return this.state === 'rejected';
    }

    isResolved() {
        return this.state === 'resolved';
    }
}
