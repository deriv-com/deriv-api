export default class CustomPromise extends Promise {
    constructor(cb = () => {}) {
        let resolve, reject;

        super((parentResolve, parentReject) => {
            resolve = parentResolve;
            reject  = parentReject;
        });

        cb(resolve, reject);

        this.resolveCallback = resolve;
        this.rejectCallback  = reject;
    }
    resolve(data) {
        this.resolveCallback(data)
        return this;
    }
    reject(error) {
        this.rejectCallback(error)
        return this;
    }
}
