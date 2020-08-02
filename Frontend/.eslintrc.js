module.exports = {
    extends: 'airbnb',
    parser: 'babel-eslint',
    plugins: ['react', 'import', 'flowtype', 'jest'],
    env: {
        browser: true,
        node: true,
        'jest/globals': true
    },
    settings: {
        'import/parser': 'babel-eslint',
        'import/ignore': ['node_modules', '.(json|less|css|xml)$'],
        'import/resolver': {
            webpack: {
                config: './webpack/base.config.js'
            },
            node: {
                paths: ['./']
            }
        },
        react: {
            pragma: 'React',
            version: '16.5'
        }
    },
    globals: {
        react_disableWarnings: true,
        react_enableWarnings: true
    },
    rules: {
        'arrow-body-style': 'warn',
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
        'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
        'class-methods-use-this': 'warn',
        'comma-dangle': ['error', 'always-multiline'],
        complexity: 'off',
        'consistent-return': 'warn',
        curly: ['error', 'all'],
        'default-case': 'warn',
        'flowtype/define-flow-type': 'warn',
        'flowtype/no-types-missing-file-annotation': 'error',
        'flowtype/no-weak-types': [
            'warn',
            { any: true, Object: false, Function: false }
        ],
        'flowtype/use-flow-type': 'warn',
        'func-name-matching': 'warn',
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
        'guard-for-in': 'warn',
        'import/default': 'error',
        'import/extensions': ['warn', 'always', { js: 'never', jsx: 'never' }],
        'import/first': 'warn',
        'import/named': 'error',
        'import/namespace': 'error',
        'import/newline-after-import': 'error',
        'import/no-commonjs': 'error',
        'import/no-deprecated': 'warn',
        'import/no-dynamic-require': 'warn',
        'import/no-extraneous-dependencies': 'warn',
        'import/no-unresolved': ['error', { commonjs: true, amd: false }],
        'import/no-webpack-loader-syntax': 'warn',
        'import/prefer-default-export': 'warn',
        'import/unambiguous': 'warn',
        indent: ['error', 4, { SwitchCase: 1 }],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error',
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/anchor-has-content': 'warn',
        'jsx-a11y/aria-role': 'warn',
        'jsx-a11y/html-has-lang': 'warn',
        'jsx-a11y/iframe-has-title': 'warn',
        'jsx-a11y/interactive-supports-focus': 'warn',
        'jsx-a11y/media-has-caption': 'warn',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
        'jsx-a11y/no-noninteractive-tabindex': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-quotes': ['error', 'prefer-single'],
        'linebreak-style': 'off',
        'max-depth': ['warn', 2],
        'max-len': [
            'warn',
            120,
            4,
            { ignoreUrls: true, ignoreComments: false }
        ],
        'max-nested-callbacks': ['error', 3],
        'max-params': ['warn', 3],
        'max-statements': 'off',
        'new-parens': 'warn',
        'newline-after-var': ['error', 'always'],
        'newline-per-chained-call': 'warn',
        'no-case-declarations': 'warn',
        'no-cond-assign': ['warn', 'always'],
        'no-confusing-arrow': 'warn',
        'no-console': 'error',
        'no-continue': 'warn',
        'no-mixed-operators': 'warn',
        'no-multiple-empty-lines': ['error', { max: 2 }],
        'no-param-reassign': ['warn', { props: false }],
        'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
        'no-restricted-imports': [
            'warn',
            'moment',
            '@fortawesome/react-fontawesome'
        ],
        'no-restricted-properties': 'warn',
        'no-restricted-syntax': 'warn',
        'no-return-assign': 'warn',
        'no-shadow': 'warn',
        'no-underscore-dangle': [
            'error',
            {
                allow: ['_exception', '__html']
            }
        ],
        'no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true }
        ],
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
                varsIgnorePattern: '^React$',
                ignoreRestSiblings: true
            }
        ],
        'no-use-before-define': 'warn',
        'no-useless-escape': 'warn',
        'object-curly-spacing': ['error', 'always'],
        'one-var': ['warn', 'never'],
        'one-var-declaration-per-line': 'warn',
        'prefer-arrow-callback': 'warn',
        'prefer-const': 'warn',
        'prefer-promise-reject-errors': ['warn', { allowEmptyReject: false }],
        'prefer-template': 'warn',
        'quote-props': ['warn', 'consistent-as-needed'],
        'react/destructuring-assignment': 'off',
        'react/display-name': ['warn', { ignoreTranspilerName: false }],
        'react/forbid-prop-types': ['error', { forbid: ['any'] }],
        'react/jsx-curly-brace-presence': ['warn', 'never'],
        'react/jsx-filename-extension': 'warn',
        'react/jsx-first-prop-new-line': 'warn',
        'react/jsx-handler-names': [
            'warn',
            { eventHandlerPrefix: 'handle', eventHandlerPropPrefix: 'on' }
        ],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-key': 'error',
        'react/jsx-max-props-per-line': ['warn', { maximum: 2 }],
        'react/jsx-no-target-blank': 'error',
        'react/jsx-wrap-multilines': 0,
        'react/no-array-index-key': 'warn',
        'react/no-children-prop': 'warn',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'warn',
        'react/no-multi-comp': ['warn', { ignoreStateless: true }],
        'react/no-unused-prop-types': 'warn',
        'react/prefer-stateless-function': [
            'warn',
            { ignorePureComponents: true }
        ],
        'react/prop-types': 'error',
        'react/require-default-props': 'warn',
        'react/require-optimization': [
            'warn',
            {
                allowDecorators: ['pureRender', 'connect']
            }
        ],
        'react/sort-comp': [
            'error',
            {
                order: [
                    '/^p.+$/',
                    'static-methods',
                    'mixins',
                    'displayName',
                    'actions',
                    'contextTypes',
                    'childContextTypes',
                    'propTypes',
                    'defaultProps',
                    'pure',
                    'statics',
                    'state',
                    'constructor',
                    'getDefaultProps',
                    'getInitialState',
                    'getChildContext',
                    'getDerivedStateFromProps',
                    'UNSAFE_componentWillMount',
                    'componentDidMount',
                    'UNSAFE_componentWillReceiveProps',
                    'shouldComponentUpdate',
                    'UNSAFE_componentWillUpdate',
                    'componentDidUpdate',
                    'componentWillUnmount',
                    '/^component.+$/',
                    '/^get.+$/',
                    '/^on.+$/',
                    '/^handle.+$/',
                    'everything-else',
                    '/^render.+$/',
                    'render'
                ]
            }
        ],
        yoda: ['error', 'never', { exceptRange: true }],

        // TODO: turn on
        'react/no-will-update-set-state': 'warn',
        'react/style-prop-object': 'off',

        // TODO: refactor src and remove new temporary rules.
        // This rules appears after migration to eslint 5.6.
        camelcase: 'warn',
        'function-paren-newline': 'warn',
        'implicit-arrow-linebreak': 'warn',
        'import/no-useless-path-segments': 'warn',
        'import/order': 'warn',
        'jsx-a11y/anchor-is-valid': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/label-has-associated-control': 'warn',
        'lines-between-class-members': 'warn',
        'no-else-return': 'warn',
        'object-curly-newline': 'warn',
        'prefer-destructuring': 'warn',
        'react/default-props-match-prop-types': 'warn',
        'react/jsx-closing-tag-location': 'warn',
        'react/jsx-one-expression-per-line': 'warn',
        'react/jsx-tag-spacing': 'warn',
        'react/no-access-state-in-setstate': 'warn',
        'react/no-this-in-sfc': 'warn',
        'react/no-unused-state': 'warn'
    }
};
