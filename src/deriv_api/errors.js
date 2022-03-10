// eslint-disable-next-line max-classes-per-file
export function errorFactory(type) {
    return class GenericError extends Error {
        constructor(message) {
            super();
            this.type    = type;
            this.message = message;
        }

        toString() {
            return `${this.type}: ${this.message}`;
        }
    };
}

export class APIError extends errorFactory('APIError') {}

export class ConstructionError extends errorFactory('ConstructionError') {}
