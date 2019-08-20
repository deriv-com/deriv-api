import { objectToCacheKey }  from './utils';

/**
 * Subscription Manager - manage subscription channels
 *
 * Makes sure there is always only one subscription channel for all requests of
 * subscriptions, keeps a history of received values for the subscription of ticks
 * and forgets channels that do not have subscribers. It also ensures that
 * subscriptions are revived after connection drop/account changed.
 *
 *
 * @example
 * // This one creates a new subscription assuming it is the first one for R_100
 * api.subscribe({ ticks: 'R_100' }, console.log);
 *
 * // This one uses the existing subscription to R_100
 * api.subscribe({ ticks: 'R_100' }, console.log);
 */
export default class SubscriptionManager {
    constructor(api) {
        this.api            = api;
        this.sources        = {};
        this.subs_id_to_key = {};
        this.observers      = {};
    }

    /**
     * Subscribe to a given request, returns a stream of new responses,
     * Errors should be handled by the user of the stream
     *
     * @example
     * const ticks = api.subscribe({ ticks: 'R_100' });
     * ticks.subscribe(console.log) // Print every new tick
     *
     * @param {Object} request - A request object acceptable by the API
     *
     * @returns {Observable} - An RxJS Observable
     */
    subscribe(request) {
        if (this.sourceExists(request)) {
            return this.getSource(request);
        }

        return this.createNewSource({ ...request, subscribe: 1 });
    }

    sourceExists(request) {
        return toKey(request) in this.sources;
    }

    getSource(request) {
        return this.sources[toKey(request)];
    }

    createNewSource(request) {
        const source = this.api.sendAndGetSource(request);

        const key = toKey(request);

        this.sources[key] = source;

        this.observers[key] = source.subscribe(this.saveSubsId(key), this.removeKeyOnError(key));

        return source;
    }

    async forget(id) {
        const forget_response = await this.api.send({ forget: id });

        this.removeBySubsIds(id);

        return forget_response;
    }

    async forgetAll(...types) {
        const forget_response = await this.api.send({ forget_all: types });

        this.removeBySubsIds(...forget_response.forget_all);

        return forget_response;
    }

    removeBySubsIds(...subs_ids) {
        subs_ids.forEach((id) => {
            delete this.sources[this.subs_id_to_key[id]];
            delete this.subs_id_to_key[id];
        });
    }

    saveSubsId(key) {
        return ({ subscription }) => {
            if (!subscription) return;

            const { id } = subscription;

            if (!(id in this.subs_id_to_key)) {
                this.subs_id_to_key[id] = key;

                // We've got what we're looking for, time to stop observing
                this.observers[key].unsubscribe();
                delete this.observers[key];
            }
        };
    }

    removeKeyOnError(key) {
        return () => {
            delete this.sources[key];
            delete this.observers[key];
        };
    }
}

function toKey(request) {
    return objectToCacheKey(request);
}
