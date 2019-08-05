import Cache from './Cache';

/**
 * Storage - A permanent storage for data, kept in browser and is useful for
 * data that is valid over extended periods of time.
 *
 * @example
 * // Read the data from storage if available
 * const cachedSymbols = await api.storage.activeSymbols();
 */
export default class Storage extends Cache {}
