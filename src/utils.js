export function isInMiliSeconds(epoch) {
    return epoch.toString().length >= 13;
}

const defaultRange = {
    end  : 'latest',
    count: 1000,
};

export function parseHistoryArgs(options = {}) {
    let parsed = {};

    if (typeof options === 'string') {
        parsed.symbol = options;
        parsed.range  = defaultRange;
    } else {
        parsed        = { ...options };
        parsed.range  = { ...defaultRange, ...options.range };
        parsed.symbol = options.symbol;
    }

    return parsed;
}

function toSeconds(epoch) {
    return isInMiliSeconds(epoch) ? Math.floor(epoch / 1000) : epoch;
}

function dateToServerEpoch(date) {
    if (!date) return date;

    if (date instanceof Date) return toSeconds(date.getTime());

    return toSeconds(date);
}

export function parseRequestRange({ start, end, count } = {}) {
    const request = {};

    if (count) request.count = count;
    if (start) request.start = dateToServerEpoch(start);
    if (end) request.end = dateToServerEpoch(end);

    return request;
}

export function mapApiFields(request, mapping) {
    const clone = { ...request };

    Object.keys(clone).forEach((field) => {
        if (field in mapping) {
            const value = delete clone[field];

            clone[mapping[field]] = value;
        }
    });

    return clone;
}

export function toPipSized(pip) {
    return Math.abs(Math.log10(pip));
}

const moneyOptions = {
    BTC: {
        maximumFractionDigits: 8,
        minimumFractionDigits: 8,
    },
    ETH: {
        maximumFractionDigits: 8,
        minimumFractionDigits: 8,
    },
    LTC: {
        maximumFractionDigits: 8,
        minimumFractionDigits: 8,
    },
    UST: {
        maximumFractionDigits: 8,
        minimumFractionDigits: 8,
    },
    default: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    },
};

export function displayMoney(value, currency, lang) {
    const options = currency in moneyOptions ? moneyOptions[currency] : moneyOptions.default;

    if (typeof Intl === 'undefined') {
        return value.toFixed(options.maximumFractionDigits);
    }

    return new Intl.NumberFormat(lang, { ...options, currency }).format(value);
}
