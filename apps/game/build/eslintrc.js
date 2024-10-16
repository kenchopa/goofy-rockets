module.exports = {
    root: true,
    ignorePatterns: ['node_modules/**/*'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        node: true,
        commonjs: true,
        browser: true,
        es6: true,
        es2017: true,
    },
    extends: [
        'eslint:recommended', // Default recommended rules
        'plugin:eslint-plugin-prettier/recommended', // Enable prettier support
    ],
    rules: {
        'no-async-promise-executor': 'off',
        'no-prototype-builtins': 'off',
        'prettier/prettier': ['error', JSON.parse(require('fs').readFileSync('build/prettierrc.json'))],
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: 'build/',
                project: ['tsconfig.all.json'],
            },
            extends: [
                'plugin:@typescript-eslint/eslint-plugin/eslint-recommended', // Adjust default rules for typescript support
                'plugin:@typescript-eslint/eslint-plugin/recommended', // Default typescript rules
                'plugin:@typescript-eslint/eslint-plugin/recommended-requiring-type-checking', // Enable typescript typechecking
                'plugin:eslint-plugin-prettier/recommended', // Enable prettier support again after TS extends
            ],
            rules: {
                '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/restrict-template-expressions': 'warn',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/naming-convention': ['error', { selector: 'enumMember', format: ['PascalCase'] }],
            },
        },
    ],
};
