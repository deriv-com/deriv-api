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
