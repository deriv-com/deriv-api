import { Observable } from 'rxjs';

export default class CustomObservable extends Observable {
    constructor(callback = () => {}) {
        const observers = [];

        super((observer) => {
            observers.push(observer);
            callback(observer);
        });

        this.observers = observers;
    }

    get openObservers() {
        return this.observers.filter(o => !o.closed);
    }

    publish(obj) {
        this.openObservers.forEach(e => e.next(obj));
    }

    error(errorMessage) {
        this.openObservers.forEach(e => e.error(errorMessage));
    }

    complete() {
        this.openObservers.forEach(e => e.complete());
    }
}
