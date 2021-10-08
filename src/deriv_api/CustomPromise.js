export default class CustomPromise extends Promise {
    constructor(cb = () => {}) {
        console.log('constructor');
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
        console.log('wrap');
        if (promise instanceof this) return promise;

        const custom_promise = new this();

        promise.then(
            custom_promise.resolve.bind(custom_promise),
            custom_promise.reject.bind(custom_promise),
        );

        return custom_promise;
    }

    resolve(data) {
        console.log('resolve');
        this.resolveCallback(data);

        this.state = 'resolved';

        return this;
    }

    reject(error) {
        console.log('reject');
        this.rejectCallback(error);

        this.state = 'rejected';

        return this;
    }

    isPending() {
        console.log('ispending');
        return this.state === 'pending';
    }

    isRejected() {
        console.log('rejected');
        return this.state === 'rejected';
    }

    isResolved() {
        console.log('resolved');
        return this.state === 'resolved';
    }
}
