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

export class CallError extends errorFactory('CallError') {}

export class ResponseError extends Error {
    constructor(response) {
        const { code, message, details } = response.error;

        super();
        this.type    = 'ResponseError';
        this.code    = code;
        this.message = message;
        this.details = details;
    }

    toString() {
        return `${this.code}: ${this.message}`;
    }
}
