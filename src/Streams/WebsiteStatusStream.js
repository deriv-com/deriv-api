import Monetary from '../Types/Monetary'; /* eslint-disable-line no-unused-vars */
import Stream   from '../Types/Stream';

/**
 * An abstract class for website status info
 *
 * @example
 * const website_status = await api.websiteStatus();
 *
 * const is_website_up = website_status.is_website_up;
 *
 * website_status.onUpdate(s => console.log(`Site is ${s.status}`));
 *
 * @param {DerivAPI} api
 *
 * @property {String} status - 'up', 'down'
 * @property {Boolean} is_website_up
 * @property {Object} currencies
 * @property {String} country
 * @property {Object[]} call_limits
 * @property {String[]} languages
 * @property {String} terms_and_condtions_version
 */
export default class WebsiteStatusStream extends Stream {
    // Called by the API to initialize the instance
    async init() {
        return this;
    }
}
