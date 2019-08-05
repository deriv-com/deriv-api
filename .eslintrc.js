module.exports = {
    extends: [
        'airbnb-base',
    ],
    plugins: [
        'align-assignments',
        'arca',
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
        'arca/import-align'                  : 2,
        'arca/import-ordering'               : 2,
        'arca/newline-after-import-section'  : 2,
        'camelcase'                          : 0,
        'key-spacing'                        : ['error', { align: 'colon' }],
        'max-len'                            : ['error', 100, 2, { comments: 120, ignoreUrls: true, ignoreComments: false, ignoreRegExpLiterals: true, ignoreStrings: true, ignoreTemplateLiterals: true, }],
        'no-multi-spaces'                    : 0,
        'no-param-reassign'                  : ['error', {props: false }],
        'no-plusplus'                        : 0,
        'no-underscore-dangle'               : ['error', { allow: ['_data'] }],
        'no-use-before-define'               : 0,
    },
};
