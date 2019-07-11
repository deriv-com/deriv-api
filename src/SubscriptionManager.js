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
 * api.subscribeWithCallback({ ticks: 'R_100' }, console.log);
 *
 * // This one uses the existing subscription to R_100
 * api.subscribeWithCallback({ ticks: 'R_100' }, console.log);
 */
export default class SubscriptionManager {}
