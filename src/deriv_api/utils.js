import serialize             from 'json-stable-stringify';

// eslint-disable-next-line import/prefer-default-export
export function objectToCacheKey(obj) {
    const cloned_object = { ...obj };

    delete cloned_object.req_id;
    delete cloned_object.passthrough;
    delete cloned_object.subscribe;

    return serialize(cloned_object);
}
