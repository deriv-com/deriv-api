import { Observable } from 'rxjs';
export default class CustomObservable extends Observable {
    constructor(cb = () => {}) {
        const containers = [];

        super((o) => {
            containers.push(o)
        });

        this.containers = containers;
    }
    publish(obj) {
        this.containers.forEach(e => e.next(obj))
    }
}
