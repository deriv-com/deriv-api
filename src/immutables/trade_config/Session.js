import Immutable from '../../types/Immutable';

/**
 * A wrapper class for trading sessions
 *
 * @property {String}            type          - `spot`, `forward`
 * @property {String|CustomDate} start         - Start of the session
 * @property {Object}            trade_options - Available options for trading, including durations, barriers
 * @property {TradeOption}       trade_options.tick
 * @property {TradeOption}       trade_options.second
 * @property {TradeOption}       trade_options.minute
 * @property {TradeOption}       trade_options.hour
 * @property {TradeOption}       trade_options.day
 */
export default class Session extends Immutable {}
