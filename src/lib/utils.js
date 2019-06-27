import { ConstructionError } from './error';

export default function getUrl(originalEndpoint) {
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
