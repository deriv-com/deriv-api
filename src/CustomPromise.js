export default class CustomPromise extends Promise {
    constructor(cb = () => {}) {
        let resolve, reject;

        super((parentResolve, parentReject) => {
            resolve = parentResolve;
            reject  = parentReject;
        });

        cb(resolve, reject);

        this.resolve = resolve;
        this.reject  = reject;
    }
}
