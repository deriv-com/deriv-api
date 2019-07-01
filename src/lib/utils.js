import serialize from 'json-stable-stringify';
import { ConstructionError } from './error';

export function getUrl(originalEndpoint) {
    if (typeof originalEndpoint !== 'string') {
        throw new ConstructionError(
            `Endpoint must be a string, passed: ${typeof originalEndpoint}`,
        );
    }

    let url;

    try {
        // eslint-disable-next-line no-unused-vars
        const [_, protocol, endpoint] = originalEndpoint.match(
            /((?:\w*:\/\/)*)(.*)/,
        );

        url = new URL(`${protocol === 'ws://' ? protocol : 'wss://'}${endpoint}`);
    } catch (e) {
        throw new ConstructionError(`Invalid URL: ${originalEndpoint}`);
    }

    return url;
}

export function tradingTimesToObject(tradingTimesResponse) {
    return tradingTimesResponse.trading_times.markets
        .map(m => m.submarkets).reduce((a, v) => a.concat(v), [])
        .map(s => s.symbols).reduce((a, v) => a.concat(v), [])
        .reduce((a, s) => ({ ...a, [s.symbol]: s }), {});
}

export function assetIndexToObject(assetIndexResponse) {
    return assetIndexResponse.asset_index
        .reduce((a, v) => ({ ...a, [v[0]]: v[2] }), {});
}

export function objectToCacheKey(obj) {
    const clonedObj = { ...obj };

    delete clonedObj.req_id;
    delete clonedObj.passthrough;
    delete clonedObj.subscribe;

    return serialize(clonedObj);
}
