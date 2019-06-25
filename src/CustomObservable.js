import { Observable } from 'rxjs';
export default class CustomObservable extends Observable {
    constructor(cb = () => {}) {
        const observers = [];

        super((observer) => {
            observers.push(observer)
        });

        this.observers = observers;
    }
    publish(obj) {
        this.observers.forEach(e => e.next(obj))
    }
}
