import Immutable from '../Types/Immutable';
import CustomDate from '../Types/CustomDate'; /* eslint-disable-line no-unused-vars */
import Monetary from '../Types/Monetary'; /* eslint-disable-line no-unused-vars */

/**
 * A class for transaction objects
 *
 * @property {String} action
 * @property {Monetary} amount
 * @property {Number} transactionId
 * @property {CustomDate} time
 */
export default class Transaction extends Immutable {}
