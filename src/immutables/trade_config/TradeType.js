import Immutable from '../../types/Immutable';

/**
 * A wrapper class for trade type config used to create a contract
 *
 * @property {FullName}                       name     - The trade type name
 * @property {String[]}                       basis    - The trade's applicable basis
 * @property {(SpotSession|ForwardSession)[]} sessions - Available sessions
 */
export default class TradeType extends Immutable {}
