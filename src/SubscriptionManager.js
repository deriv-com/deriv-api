/**
 * Subscription Manager - manage subscription channels
 *
 * Makes sure there is always one subscription channel for all requests of
 * subscriptions, and forgets channels that don't have subscribers. It also
 * ensures that subscriptions are revived after connection drop.
 *
 * @example
 * // This one creates a new subscription assuming it is the first one for R_100
 * api.subscribeWithCallback({ ticks: 'R_100' }, console.log);
 *
 * // This one uses the existing subscription to R_100
 * api.subscribeWithCallback({ ticks: 'R_100' }, console.log);
 */
export default class SubscriptionManager {}
