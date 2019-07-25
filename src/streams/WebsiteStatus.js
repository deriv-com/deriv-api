import { map, first } from 'rxjs/operators';

import Monetary       from '../fields/Monetary'; /* eslint-disable-line no-unused-vars */
import Stream         from '../types/Stream';

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
 * @property {String}   status - 'up', 'down'
 * @property {Boolean}  is_website_up
 * @property {String}   country
 * @property {Object}   currencies
 * @property {Object}   call_limits
 * @property {String[]} languages
 * @property {String}   terms_and_conditions_version
 */
export default class WebsiteStatus extends Stream {
    constructor(api) {
        super({ api });
    }

    // Called by the API to initialize the instance
    async init() {
        const website_status_stream = this.api.basic.subscribe({ website_status: 1 });

        this.addSource(website_status_stream.pipe(map(wrapWebsiteStatus)));

        this.beforeUpdate((website_status) => {
            Object.assign(this._data, website_status);
        });

        await website_status_stream.pipe(first()).toPromise();
    }

    get is_website_up() {
        return this._data.status === 'up';
    }
}

function wrapWebsiteStatus({ website_status }) {
    return {
        status                     : website_status.site_status,
        currencies                 : website_status.currencies_config,
        country                    : website_status.clients_country,
        call_limits                : website_status.api_call_limits,
        languages                  : website_status.supported_languages,
        terms_and_condtions_version: website_status.terms_conditions_version,
    };
}
