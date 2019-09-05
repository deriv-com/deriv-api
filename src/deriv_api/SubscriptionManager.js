import {
    first, finalize, share,
} from 'rxjs/operators';

import { objectToCacheKey }               from './utils';

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
 * const subscriber1 = api.subscribe({ ticks: 'R_100' }, console.log);
 *
 * // This one uses the existing subscription to R_100
 * const subscriber2 = api.subscribe({ ticks: 'R_100' }, console.log);
 *
 * subscriber1.unsubscribe(); // no API forget yet
 * subscriber2.unsubscribe(); // Issues API forget
 *
 */
export default class SubscriptionManager {
    constructor(api) {
        this.api                   = api;
        this.sources               = {};
        this.subs_id_to_key        = {};
        this.key_to_subs_id        = {};
        this.subs_ids_per_msg_type = [];
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
        const key = toKey(request);

        const source = this.api.sendAndGetSource(request).pipe(
            finalize(() => {
                if (!(key in this.key_to_subs_id)) return;

                // Forget subscriptions, but don't complain if failed
                this.forget(this.key_to_subs_id[key]).then(() => {}, () => {});
            }),
            share(),
        );

        this.sources[key] = source;

        source.pipe(first()).toPromise()
            .then((response) => {
                if (request.buy) {
                    const poc_key         = toKey({
                        contract_id           : response.buy.contract_id,
                        proposal_open_contract: 1,
                    });
                    this.sources[poc_key] = this.sources[key];
                }
                return response;
            })
            .then(this.saveSubsId(key), this.removeKeyOnError(key));

        return source;
    }

    async forget(id) {
        const forget_response = await this.api.send({ forget: id });

        this.completeSubsByIds(id);

        return forget_response;
    }

    async forgetAll(...types) {
        const forget_response = await this.api.send({ forget_all: types });

        // To include subscriptions that were automatically unsubscribed
        // for example a proposal subscription is auto-unsubscribed after buy
        const subs_ids = [];

        types.forEach(type => subs_ids.push(...(this.subs_ids_per_msg_type[type] || [])));

        this.completeSubsByIds(...subs_ids);

        return forget_response;
    }

    completeSubsByIds(...subs_ids) {
        subs_ids.forEach((id) => {
            const key = this.subs_id_to_key[id];

            delete this.subs_id_to_key[id];

            this.completeSubsByKey(key);
        });
    }

    saveSubsId(key) {
        return (response) => {
            const {
                subscription,
                msg_type,
            } = response;

            // If the response doesn't have a subs id, it's not a subscription, so complete source
            // Useful for poc for sold contract which never returns subscription
            if (!subscription) return this.completeSubsByKey(key);

            const { id } = subscription;

            if (!(id in this.subs_id_to_key)) {
                this.subs_id_to_key[id]              = key;
                this.key_to_subs_id[key]             = id;
                this.subs_ids_per_msg_type[msg_type] = this.subs_ids_per_msg_type[msg_type] || [];
                this.subs_ids_per_msg_type[msg_type].push(id);
            }

            return response;
        };
    }

    removeKeyOnError(key) {
        return () => this.completeSubsByKey(key);
    }

    completeSubsByKey(key) {
        if (!key) return;

        // Delete the source
        const source = this.sources[key];
        delete this.sources[key];

        // Delete the subs id if exists
        const subs_id = this.key_to_subs_id[key];
        delete this.subs_id_to_key[subs_id];

        // Delete the key
        delete this.key_to_subs_id[key];

        // Mark the source completed
        source.complete();
    }
}

function toKey(request) {
    return objectToCacheKey(request);
}
