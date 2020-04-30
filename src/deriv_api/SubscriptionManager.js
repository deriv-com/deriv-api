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
        this.api                    = api;
        this.sources                = {};
        this.subs_id_to_key         = {};
        this.key_to_subs_id         = {};
        this.buy_key_to_contract_id = {};
        this.subs_ids_per_msg_type  = [];
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
    subscribe(request, should_force) {
        if (this.sourceExists(request) && !should_force) {
            return this.getSource(request);
        }

        return this.createNewSource({ ...request, subscribe: 1 });
    }

    getSource(request) {
        const key = toKey(request);
        if (key in this.sources) return this.sources[key];

        // If we have a buy subscription reuse that for poc
        if (request.proposal_open_contract && request.contract_id) {
            const poc_source = Object.values(this.buy_key_to_contract_id)
                .find(c => c.contract_id === request.contract_id);

            if (poc_source) {
                return this.sources[poc_source.buy_key];
            }
        }

        return undefined;
    }

    // Just an alias to getSource
    sourceExists(request) {
        return this.getSource(request);
    }

    createNewSource(request) {
        const key = toKey(request);

        const source = this.api.sendAndGetSource(request).pipe(
            finalize(() => {
                if (!(key in this.key_to_subs_id)) return;
                console.log('this.key_to_subs_id[key]', this.key_to_subs_id[key]);
                // Forget subscriptions, but don't complain if failed
                this.forget(this.key_to_subs_id[key]).then(() => {}, () => {});
            }),
            share(),
        );

        this.sources[key] = source;

        source.pipe(first()).toPromise()
            .then((response) => {
                if (request.buy) {
                    this.buy_key_to_contract_id[key] = {
                        contract_id: response.buy.contract_id,
                        buy_key    : key,
                    };
                }
                this.saveSubsId(key, response);
            }, this.removeKeyOnError(key));


        return source;
    }

    forget(id) {
        this.completeSubsByIds(id);

        return this.api.send({ forget: id });
    }

    forgetAll(...types) {
        // To include subscriptions that were automatically unsubscribed
        // for example a proposal subscription is auto-unsubscribed after buy
        const subs_ids = [];

        types.forEach(type => subs_ids.push(...(this.subs_ids_per_msg_type[type] || [])));

        this.completeSubsByIds(...subs_ids);

        return this.api.send({ forget_all: types });
    }

    completeSubsByIds(...subs_ids) {
        subs_ids.forEach((id) => {
            const key = this.subs_id_to_key[id];

            delete this.subs_id_to_key[id];

            this.completeSubsByKey(key);
        });
    }

    saveSubsId(key, { subscription, msg_type }) {
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

        return undefined;
    }

    refreshActiveSubs() {
        const active_subscriptions = Object.keys(this.sources);

        // update subs_ids_per_msg_type, subs_id_to_key, key_to_subs_id
        active_subscriptions.forEach((subscription_request) => {
            this.subscribe(JSON.parse(subscription_request), true);
        });
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

        // Delete the buy key to contract_id mapping
        delete this.buy_key_to_contract_id[key];

        // Mark the source completed
        source.complete();
    }
}

function toKey(request) {
    return objectToCacheKey(request);
}
