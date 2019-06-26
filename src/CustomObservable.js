import { Observable } from 'rxjs';
export default class CustomObservable extends Observable {
    constructor(callback = () => {}) {
        const observers = [];

        super((observer) => {
            observers.push(observer)
            callback(observer)
        });

        this.observers = observers;
    }
    publish(obj) {
        this.observers.forEach(e => e.next(obj))
    }
    error(errorMessage) {
        this.observers.forEach(e => e.error(errorMessage))
    }
}
