import '../Types/CustomDate';
import '../Types/Monetary';
import Immutable  from '../Types/Immutable';

/**
 * A class for transaction objects
 *
 * @property {String} action
 * @property {Monetary} amount
 * @property {Number} transaction_id
 * @property {CustomDate} time
 */
export default class Transaction extends Immutable {}
