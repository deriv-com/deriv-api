import Immutable from './Immutable';

/**
 * A class for keeping short and full name of things
 *
 * @param {String} full - Full form of the name
 * @param {String} short - short form of the name
 *
 * @example
 * const lc = account.landing_company;
 *
 * console.log(`Landing Company: ${lc.full}, Short code: ${lc.short}`);
 *
 * @property {String} code - alias for this.short
 * @property {String} shortcode - alias for this.short
 */
export default class FullName extends Immutable {}
