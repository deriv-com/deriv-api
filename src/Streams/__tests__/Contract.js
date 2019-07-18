import DerivAPIBasic from '../../DerivAPI/DerivAPIBasic';
import Contract      from '../Contract';

let api;
let contract;
let global_req_id;
let buy;

global.WebSocket = jest.fn();

const proposal_request = {
    amount       : 1,
    basis        : 'payout',
    contract_type: 'CALL',
    currency     : 'USD',
    duration     : 60,
    duration_unit: 's',
    barrier      : '+0.1',
    symbol       : 'R_100',
};

const now               = parseInt(new Date().getTime() / 1000, 10);
const proposal_response = {
    ask_price    : 0.5,
    date_start   : now,
    display_value: '0.50',
    longcode     : 'win payout if volatility 100 index is strictly higher than entry spot plus 0.10 at 1 minute after contract start time.',
    payout       : 1,
    spot         : 1234.5,
    spot_time    : now,
};

const buy_response = {
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

const open_contract_response = {
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
};

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    contract = new Contract(api, proposal_request);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        const request                              = JSON.parse(msg);
        const { req_id, active_symbols, proposal } = request;

        global_req_id = req_id;

        if (active_symbols) sendMessage('active_symbols', [{ symbol: 'R_100', pip: 0.01 }]);
        if (proposal) sendMessage('proposal', proposal_response);
    });

    await contract.init();
});

test('Request for proposal contract', async () => {
    expect(contract).toBeInstanceOf(Contract);

    expect(() => { contract.type = 'test'; }).toThrow(Error);

    const {
        ask_price, spot, spot_time, display_value,
    } = proposal_response;

    expect(contract.ask_price.value).toBe(ask_price);
    expect(contract.ask_price.display).toBe(display_value);
    expect(contract.start_time.isSameOrBefore(new Date())).toBeTruthy();
    expect(contract.current_spot.value).toBe(spot);
    expect(contract.current_spot.pip_sized).toBe(spot.toFixed(2));
    expect(contract.current_spot.time.isSame(spot_time)).toBeTruthy();
});

test('Proposal update', async () => {
    const { spot_time, date_start } = proposal_response;

    sendMessage('proposal', {
        ...proposal_response,
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
    setTimeout(() => sendMessage('buy', buy_response), 100);

    buy = await contract.buy();

    expect(buy.price.value).toBe(buy_response.buy_price);
    expect(buy.price.display).toBe(buy_response.buy_price.toFixed(2));

    expect(buy.purchase_time.isSame(buy_response.purchase_time)).toBeTruthy();
    expect(buy.start_time.isSame(buy_response.start_time)).toBeTruthy();

    expect(contract.purchase_time.isSame(buy.purchase_time)).toBeTruthy();
    expect(contract.id).toBe(buy.contract_id);
    expect(contract.buy_transaction).toBe(buy.transaction_id);
    expect(contract.status).toBe('open');
    expect(contract.is_open).toBeTruthy();
});

test('Receiving contract updates while open', async () => {
    sendMessage('proposal_open_contract', open_contract_response);

    const {
        buy_price,
        bid_price,
        profit,
        profit_percentage,
        payout,
        display_value,
        date_start,
        purchase_time,
        current_spot,
        current_spot_display_value,
        current_spot_time,
        entry_tick,
        entry_tick_display_value,
        entry_tick_time,
        date_expiry,
        longcode,
        shortcode,
        underlying,
    } = open_contract_response;

    expect(contract.current_spot.value).toBe(current_spot);
    expect(contract.current_spot.display).toBe(current_spot_display_value);
    expect(contract.current_spot.time.isSame(current_spot_time)).toBeTruthy();

    expect(contract.entry_spot.value).toBe(entry_tick);
    expect(contract.entry_spot.display).toBe(entry_tick_display_value);
    expect(contract.entry_spot.time.isSame(entry_tick_time)).toBeTruthy();

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

    expect(contract.symbol).toBe(underlying);

    [
        'currency',
        'barrier_count',
        'shortcode',
        'longcode',
        'validation_error',
        'is_forward_starting',
        'is_intraday',
        'is_path_dependent',
        'is_valid_to_sell',
    ].forEach((field) => {
        expect(contract[field]).toBe(open_contract_response[field]);
    });
});

test('Open contract update - new spot', async () => {
    sendMessage('proposal_open_contract', {
        ...open_contract_response,
        current_spot              : 1222.2,
        current_spot_display_value: '1222.20',
        current_spot_time         : now + 2,
    });

    expect(contract.current_spot.value).toBe(1222.2);
    expect(contract.current_spot.display).toBe('1222.20');
    expect(contract.current_spot.time.isSame(now + 2)).toBeTruthy();
});

test('Open contract update - valid to sell', async () => {
    sendMessage('proposal_open_contract', {
        ...open_contract_response,
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

function sendMessage(type, obj) {
    api.connection.onmessage({
        data: JSON.stringify({
            req_id  : global_req_id,
            msg_type: type,
            [type]  : obj,
        }),
    });
}
