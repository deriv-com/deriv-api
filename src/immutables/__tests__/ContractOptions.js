import DerivAPI          from '../../DerivAPI';
import CustomDate        from '../../fields/CustomDate';
import { TestWebSocket } from '../../test_utils';
import ContractOptions   from '../ContractOptions';

const response = {};

let contract_options;
let category;

test('Contract options has all the valid options', () => {
    expect(contract_options).toBeInstanceOf(ContractOptions);
    expect(() => { contract_options.categories = []; }).toThrow(Error);
    expect(new Set(Object.keys(contract_options.categories))).toEqual(new Set(['risefall', 'higherlower', 'callputspread']));
    expect(contract_options.currencies).toEqual(response.payout_currencies);
});

test('Category object', () => {
    category = contract_options.categories.risefall;
    expect(category.name.short).toBe('risefall');
    expect(category.name.full).toBe('Rise/Fall');
    expect(new Set(category.contract_types)).toEqual(new Set(['CALL', 'PUT']));
    expect(new Set(category.bases)).toEqual(new Set(['stake', 'payout']));
    expect(category.forward_starting).toBeInstanceOf(Object);
    expect(new Set(Object.keys(category.expiry_types))).toEqual(new Set(['seconds', 'minutes', 'hours']));
});

test('forward starting contracts', () => {
    expect(Object.keys(category.forward_starting)).toEqual(['1564704000', '1564790400', '1564876800']);

    Object.values(category.forward_starting).forEach((session) => {
        expect(session.min.isBefore(session.max)).toBeTruthy();
    });
});

test('Duration expiry type', () => {
    const { minutes: { duration } } = category.expiry_types;

    expect(isDurationValid(duration)).toBeTruthy();
});

test('Barriers', () => {
    const {
        callputspread: { expiry_types: { minutes: { barriers: callputspread } } },
        risefall: { expiry_types: { minutes: { barriers: risefall } } },
        higherlower: { expiry_types: { days: { barriers: higherlower } } },
    } = contract_options.categories;

    expect(risefall.count).toBe(0);
    expect(Object.keys(risefall)).toEqual(['count']);
    expect(callputspread.count).toBe(2);
    expect(Object.keys(callputspread)).toEqual(['count', 'high', 'low']);
    expect(higherlower.count).toBe(1);
    expect(Object.keys(higherlower)).toEqual(['count', 'single']);

    expect(higherlower.single.value).toEqual(324.9305);
    expect(higherlower.single.display).toEqual('324.9305');

    expect(callputspread.low.value).toEqual(-0.0914);
    expect(callputspread.low.display).toEqual('-0.0914');
    expect(callputspread.high.value).toEqual(0.0914);
    expect(callputspread.high.display).toEqual('+0.0914');
});

function isDurationValid({ min, max }) {
    const date = new CustomDate();
    return min.addToDate(date).isBefore(max.addToDate(date));
}

beforeAll(async () => {
    response.contracts_for     = {
        available: [
            {
                barrier_category         : 'euro_atm',
                barriers                 : 0,
                contract_category        : 'callput',
                contract_category_display: 'Up/Down',
                contract_display         : 'Lower',
                contract_type            : 'PUT',
                exchange_name            : 'RANDOM',
                expiry_type              : 'intraday',
                market                   : 'volidx',
                max_contract_duration    : '1d',
                min_contract_duration    : '15s',
                sentiment                : 'down',
                start_type               : 'spot',
                submarket                : 'random_index',
                underlying_symbol        : 'R_50',
            },
            {
                barrier_category         : 'euro_atm',
                barriers                 : 0,
                contract_category        : 'callput',
                contract_category_display: 'Up/Down',
                contract_display         : 'Higher',
                contract_type            : 'CALL',
                exchange_name            : 'RANDOM',
                expiry_type              : 'intraday',
                forward_starting_options : [
                    {
                        close: 1564790399,
                        date : 1564704000,
                        open : 1564704000,
                    },
                    {
                        close: 1564876799,
                        date : 1564790400,
                        open : 1564790400,
                    },
                    {
                        close: 1564963199,
                        date : 1564876800,
                        open : 1564876800,
                    },
                ],
                market               : 'volidx',
                max_contract_duration: '1d',
                min_contract_duration: '2m',
                sentiment            : 'up',
                start_type           : 'forward',
                submarket            : 'random_index',
                underlying_symbol    : 'R_50',
            },
            {
                barrier_category         : 'euro_non_atm',
                barriers                 : 2,
                contract_category        : 'callputspread',
                contract_category_display: 'Call Spread/Put Spread',
                contract_display         : 'Call Spread',
                contract_type            : 'CALLSPREAD',
                exchange_name            : 'RANDOM',
                expiry_type              : 'intraday',
                high_barrier             : '+0.0914',
                low_barrier              : -0.0914,
                market                   : 'volidx',
                max_contract_duration    : '1d',
                min_contract_duration    : '15s',
                sentiment                : 'up',
                start_type               : 'spot',
                submarket                : 'random_index',
                underlying_symbol        : 'R_50',
            },
            {
                barrier                  : '324.9305',
                barrier_category         : 'euro_non_atm',
                barriers                 : 1,
                contract_category        : 'callput',
                contract_category_display: 'Up/Down',
                contract_display         : 'Higher',
                contract_type            : 'CALL',
                exchange_name            : 'RANDOM',
                expiry_type              : 'daily',
                market                   : 'volidx',
                max_contract_duration    : '365d',
                min_contract_duration    : '1d',
                sentiment                : 'up',
                start_type               : 'spot',
                submarket                : 'random_index',
                underlying_symbol        : 'R_50',
            },
        ],
    };
    response.payout_currencies = ['BTC', 'USD'];
    response.active_symbols    = [
        {
            pip   : 0.0001,
            symbol: 'R_50',
        },
    ];
    const connection           = new TestWebSocket(response);

    const api = new DerivAPI({ connection });

    contract_options = new ContractOptions(api, 'R_50');

    await contract_options.init();
});
