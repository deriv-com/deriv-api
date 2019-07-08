export function dateToServerEpoch(date) {
    if (!date) return date;

    if (date instanceof Date) return toSeconds(date.getTime());

    return toSeconds(date);
}

export function isInMiliSeconds(epoch) {
    return epoch.toString().length >= 13;
}

export function toSeconds(epoch) {
    return isInMiliSeconds(epoch) ? Math.floor(epoch / 1000) : epoch;
}

export function parseRequestRange({ start, end, count } = {}) {
    const request = {};

    if (count) request.count = count;
    if (start) request.start = dateToServerEpoch(start);
    if (end) request.end = dateToServerEpoch(end);

    return request;
}
