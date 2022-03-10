import DerivAPI          from '../../DerivAPI';
import { TestWebSocket } from '../../test_utils';
import Contract          from '../Contract';

let connection;
let contract;
let buy;
let sell;
const response = {};
const now      = parseInt(new Date().getTime() / 1000, 10);

test('Request for proposal contract', async () => {
    expect(contract).toBeInstanceOf(Contract);

    expect(() => { contract.type = 'test'; }).toThrow(Error);

    const {
        ask_price, spot, spot_time, display_value,
    } = response.proposal;

    expect(contract.ask_price.value).toBe(ask_price);
    expect(contract.ask_price.display).toBe(display_value);
    expect(contract.start_time.isSameOrBefore(new Date())).toBeTruthy();
    expect(contract.current_spot.value).toBe(spot);
    expect(contract.current_spot.pip_sized).toBe(spot.toFixed(2));
    expect(contract.current_spot.time.isSame(spot_time)).toBeTruthy();
});

test('Proposal update', async () => {
    const { spot_time, date_start } = response.proposal;

    connection.receive('proposal', {
        ...response.proposal,
        spot      : 1234.6,
        spot_time : spot_time + 1,
        date_start: date_start + 1,
    });

    expect(contract.current_spot.value).toBe(1234.6);
    expect(contract.current_spot.display).toBe('1234.60');
    expect(contract.current_spot.time.isSame(spot_time + 1)).toBeTruthy();
    expect(contract.start_time.isSame(date_start + 1)).toBeTruthy();
});

test('Buying a contract', async () => {
    buy = await contract.buy();

    expect(buy.balance_after.value).toBe(response.buy.balance_after);

    expect(buy.price.value).toBe(response.buy.buy_price);
    expect(buy.price.display).toBe(response.buy.buy_price.toFixed(2));

    expect(buy.purchase_time.isSame(response.buy.purchase_time)).toBeTruthy();
    expect(buy.start_time.isSame(response.buy.start_time)).toBeTruthy();

    expect(contract.purchase_time.isSame(buy.purchase_time)).toBeTruthy();
    expect(contract.id).toBe(buy.contract_id);
    expect(contract.buy_transaction).toBe(buy.transaction_id);
    expect(contract.status).toBe('open');
    expect(contract.is_open).toBeTruthy();
});

test('Receiving contract updates while open', async () => {
    const {
        buy_price,
        bid_price,
        profit,
        profit_percentage,
        payout,
        display_value,
        display_name,
        date_start,
        purchase_time,
        current_spot,
        current_spot_display_value,
        current_spot_time,
        entry_tick,
        entry_tick_display_value,
        entry_tick_time,
        barrier,
        date_expiry,
        longcode,
        shortcode,
        underlying,
    } = response.proposal_open_contract;

    expect(contract.current_spot.value).toBe(current_spot);
    expect(contract.current_spot.display).toBe(current_spot_display_value);
    expect(contract.current_spot.time.isSame(current_spot_time)).toBeTruthy();

    expect(contract.entry_spot.value).toBe(entry_tick);
    expect(contract.entry_spot.display).toBe(entry_tick_display_value);
    expect(contract.entry_spot.time.isSame(entry_tick_time)).toBeTruthy();

    expect(contract.barrier.display).toBe((+barrier).toFixed(2));

    expect(contract.buy_price).toEqual(buy.price);

    expect(contract.buy_price.value).toEqual(buy_price);
    expect(contract.bid_price.value).toEqual(bid_price);
    expect(contract.bid_price.display).toBe(display_value);
    expect(contract.profit.value).toBe(profit);
    expect(contract.profit.percentage).toBe(profit_percentage);
    expect(contract.payout.value).toBe(payout);

    expect(contract.start_time.epoch).toBe(date_start);
    expect(contract.purchase_time.epoch).toBe(purchase_time);

    expect(contract.expiry_time.epoch).toBe(date_expiry);

    expect(contract.code.long).toBe(longcode);
    expect(contract.code.short).toBe(shortcode);

    expect(contract.symbol.short).toBe(underlying);
    expect(contract.symbol.long).toBe(display_name);

    const checkFieldInPoc = (field) => expect(contract[field])
        .toBe(response.proposal_open_contract[field]);

    checkFieldInPoc('currency');
    checkFieldInPoc('barrier_count');
    checkFieldInPoc('shortcode');
    checkFieldInPoc('longcode');
    checkFieldInPoc('validation_error');

    const checkFlagInPoc = (field) => {
        expect(contract[field]).toBe(!!response.proposal_open_contract[field]);
    };

    checkFlagInPoc('is_forward_starting');
    checkFlagInPoc('is_intraday');
    checkFlagInPoc('is_path_dependent');
    checkFlagInPoc('is_valid_to_sell');
});

test('Open contract update - new spot', async () => {
    connection.receive('proposal_open_contract', {
        ...response.proposal_open_contract,
        current_spot              : 1222.2,
        current_spot_display_value: '1222.20',
        current_spot_time         : now + 2,
    });

    expect(contract.current_spot.value).toBe(1222.2);
    expect(contract.current_spot.display).toBe('1222.20');
    expect(contract.current_spot.time.isSame(now + 2)).toBeTruthy();
});

test('Open contract update - valid to sell', async () => {
    connection.receive('proposal_open_contract', {
        ...response.proposal_open_contract,
        current_spot              : 1222.3,
        current_spot_display_value: '1222.30',
        current_spot_time         : now + 4,
        is_valid_to_sell          : 1,
    });

    expect(contract.current_spot.value).toBe(1222.3);
    expect(contract.current_spot.display).toBe('1222.30');
    expect(contract.current_spot.time.isSame(now + 4)).toBeTruthy();
    expect(contract.is_valid_to_sell).toBeTruthy();
});

test('Open contract update - valid to sell', async () => {
    // This is not a tick contract and shouldn't have a tick_stream
    // but I was just too lazy to create a new contract for this one test.
    connection.receive('proposal_open_contract', {
        ...response.proposal_open_contract,
        ticks_count: 2,
        tick_stream: [
            {
                tick              : 90.1,
                tick_display_value: '90.10',
                epoch             : now,
            },
            {
                tick              : 92.4,
                tick_display_value: '92.40',
                epoch             : now + 2,
            },
        ],
    });

    expect(contract.ticks[0].quote.display).toBe('90.10');
    expect(contract.ticks[0].time.epoch).toBe(now);

    expect(contract.ticks[1].quote.display).toBe('92.40');
    expect(contract.ticks[1].time.epoch).toBe(now + 2);
});

test('Selling an open contract', async () => {
    sell = await contract.sell();

    expect(sell.buy_transaction).toBe(buy.transaction_id);
    expect(sell.balance_after.value).toBe(response.sell.balance_after);
    expect(sell.price.value).toBe(response.sell.sold_for);
    expect(sell.transaction_id).toBe(response.sell.transaction_id);
    expect(sell.contract_id).toBe(response.sell.contract_id);
    expect(sell.contract_id).toBe(buy.contract_id);

    expect(contract.id).toBe(sell.contract_id);
    expect(contract.sell_price).toBe(sell.price);
    expect(contract.sell_transaction).toBe(sell.transaction_id);
    expect(contract.status).toBe('sold');
    expect(contract.is_sold).toBeTruthy();
});

test('Open contract updates after sell', async () => {
    const spot = {
        value  : 1222.3,
        display: '1222.30',
        time   : now + 4,
    };
    connection.receive('proposal_open_contract', {
        ...response.proposal_open_contract,
        current_spot              : spot.value,
        current_spot_display_value: spot.display,
        current_spot_time         : spot.time,
        exit_spot                 : spot.value,
        exit_spot_display_value   : spot.display,
        exit_spot_time            : spot.time,
        sell_spot                 : spot.value,
        sell_spot_display_value   : spot.display,
        sell_spot_time            : spot.time,
        sell_time                 : spot.time,
        status                    : 'sold',
        is_settleable             : 1,
        is_sold                   : 1,
        is_valid_to_sell          : 0,
        is_expired                : 0,
    });

    const checkSpotInPoc = (field) => {
        expect(contract[field].value).toBe(spot.value);
        expect(contract[field].display).toBe(spot.display);
        expect(contract[field].time.isSame(spot.time)).toBeTruthy();
    };

    checkSpotInPoc('current_spot');
    checkSpotInPoc('exit_spot');
    checkSpotInPoc('sell_spot');

    expect(contract.sell_time.epoch).toBe(now + 4);
    expect(contract.is_settleable).toBeTruthy();
    expect(contract.is_sold).toBeTruthy();
    expect(contract.is_expired).toBeFalsy();
    expect(contract.is_open).toBeFalsy();
    expect(contract.is_valid_to_sell).toBeFalsy();
});

beforeAll(async () => {
    response.proposal = {
        ask_price    : 0.5,
        date_start   : now,
        display_value: '0.50',
        longcode     : 'win payout if volatility 100 index is strictly higher than entry spot plus 0.10 at 1 minute after contract start time.',
        payout       : 1,
        spot         : 1234.5,
        spot_time    : now,
    };

    response.buy = {
        balance_after : 1000,
        buy_price     : 0.51,
        contract_id   : 12345678,
        longcode      : 'Win payout if Volatility 100 Index is strictly higher than entry spot plus 0.10 at 1 minute after contract start time.',
        payout        : 1,
        purchase_time : now + 1,
        shortcode     : `CALL_R_100_1_${now + 1}_${now + 61}_S10P_0`,
        start_time    : now + 1,
        transaction_id: 98765,
    };

    response.proposal_open_contract = {
        contract_type             : 'CALL',
        status                    : 'open',
        contract_id               : 12345678,
        buy_price                 : 0.51,
        bid_price                 : 0.6,
        profit                    : 0.09,
        profit_percentage         : 17.65,
        payout                    : 1,
        display_value             : '0.60',
        date_start                : now + 1,
        purchase_time             : now + 1,
        current_spot              : 1234.5,
        current_spot_display_value: '1234.50',
        current_spot_time         : now,
        entry_spot                : 1234.5,
        entry_spot_display_value  : '1234.50',
        entry_tick                : 1234.5,
        entry_tick_display_value  : '1234.50',
        entry_tick_time           : now,
        currency                  : 'USD',
        barrier_count             : 1,
        barrier                   : '1234.5',
        date_settlement           : now + 61,
        date_expiry               : now + 61,
        longcode                  : 'Win payout if Volatility 100 Index is strictly higher than entry spot plus 0.10 at 1 minute after contract start time.',
        shortcode                 : `CALL_R_100_1_${now + 1}_${now + 61}_S10P_0`,
        validation_error          : 'Resale of this contract is not offered.',
        is_expired                : 0,
        is_forward_starting       : 0,
        is_intraday               : 1,
        is_path_dependent         : 0,
        is_settleable             : 0,
        is_sold                   : 0,
        is_valid_to_sell          : 0,
        transaction_ids           : { buy: 98765 },
        underlying                : 'R_100',
        display_name              : 'Volatility 100 Index',
    };

    response.sell = {
        reference_id  : 98765,
        balance_after : 1001,
        sold_for      : 1.51,
        transaction_id: 98766,
        contract_id   : 12345678,
    };

    connection = new TestWebSocket({
        active_symbols: [{ symbol: 'R_100', pip: 0.01, display_name: 'Volatility 100 Index' }],
        ...response,
    });

    const api = new DerivAPI({ connection });

    contract = new Contract(api, {
        amount       : 1,
        basis        : 'payout',
        contract_type: 'CALL',
        currency     : 'USD',
        duration     : 60,
        duration_unit: 's',
        barrier      : '+0.1',
        symbol       : 'R_100',
    });

    await contract.init();
});
