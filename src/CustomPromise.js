export default class CustomPromise extends Promise {
    constructor(cb = () => {}) {
        let resolve, reject;

        super((res, rej) => {
            resolve = res;
            reject  = rej;
        });

        cb(resolve, reject);

        this.resolve = resolve;
        this.reject  = reject;
    }
}
