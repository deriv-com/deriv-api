import Immutable from './Immutable';

/**
 * Keeps a market value and pip size
 *
 * @param {Object} market
 * @param {Number} market.value
 * @param {Number} market.pip
 *
 * @property {Number} pip_size
 * @property {Number} pip_sized - the pipsized value
 */
export default class MarketValue extends Immutable {}
