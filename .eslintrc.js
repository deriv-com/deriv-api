module.exports = {
    extends: [
        'airbnb-base',
    ],
    plugins: [
        'align-assignments',
    ],
    env: {
        browser: true,
        jest   : true,
        node   : true,
        es6    : true,
    },
    rules: {
        indent                               : ['error', 4, { SwitchCase: 1 }],
        'align-assignments/align-assignments': ['error', { requiresOnly: false } ],
        'key-spacing'                        : ['error', { align: 'colon' }],
        'no-multi-spaces'                    : 0,
        'no-param-reassign'                  : ['error', {'props': false }],
        'no-plusplus'                        : 0,
        'no-use-before-define'               : 0,
        'class-methods-use-this'             : 0,
        'no-underscore-dangle'               : ['error', { "allow": ["_data"] }],
    },
};
