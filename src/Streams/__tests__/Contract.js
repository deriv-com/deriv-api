import DerivAPIBasic from '../../DerivAPI/DerivAPIBasic';
import Contract      from '../Contract';

let api;
let contract;
let global_req_id;

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
    ask_price    : 0.1,
    date_start   : now,
    display_value: '0.10',
    longcode     : 'Win payout if Volatility 100 Index is strictly higher than entry spot plus 0.10 at 1 minute after contract start time.',
    payout       : 1,
    spot         : 1234.5,
    spot_time    : now,
};

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    contract = new Contract(api, proposal_request);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        const request                    = JSON.parse(msg);
        const { req_id, active_symbols } = request;

        global_req_id = req_id;

        if (active_symbols) return sendMessage('active_symbols', [{ symbol: 'R_100', pip: 0.01 }]);

        return sendMessage('proposal', proposal_response);
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
    expect(contract.date_start.isSameOrBefore(new Date())).toBeTruthy();
    expect(contract.spot.value).toBe(spot);
    expect(contract.spot.pip_sized).toBe(spot.toFixed(2));
    expect(contract.spot.time.isSame(spot_time)).toBeTruthy();
});

test('Proposal update', async () => {
    const { spot_time, date_start } = proposal_response;

    sendMessage('proposal', {
        ...proposal_response,
        spot      : 1234.6,
        spot_time : spot_time + 1,
        date_start: date_start + 1,
    });

    expect(contract.spot.value).toBe(1234.6);
    expect(contract.spot.display).toBe('1234.60');
    expect(contract.spot.time.isSame(spot_time + 1)).toBeTruthy();
    expect(contract.date_start.isSame(date_start + 1)).toBeTruthy();
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
