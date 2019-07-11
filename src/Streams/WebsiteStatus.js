import Stream from '../Types/Stream';
import Monetary from '../Types/Monetary'; /* eslint-disable-line no-unused-vars */

/**
 * An abstract class for website status info
 *
 * @example
 * api.websiteStatus().onUpdate(s => console.log(`Site is ${s.status}`))
 *
 * @param {DerivAPI} api
 *
 * @property {String} status - 'up', 'down'
 * @property {Object} currencies
 * @property {String} country
 * @property {Object[]} callLimits
 * @property {String[]} languages
 * @property {String} termsAndCondtionsVersion
 */
export default class WebsiteStatus extends Stream {
    // Called by the API to initialize the instance
    async init() {
        return this;
    }
}
