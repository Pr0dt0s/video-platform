// @ts-check
const { defineConfig } = require('eslint-define-config')
const baseConfig = require('../.eslintrc.base.cjs')

module.exports = defineConfig({
    ...baseConfig,
    extends: [...(baseConfig.extends || []), 'plugin:react-hooks/recommended'],
    plugins: [...(baseConfig.plugins || []), 'react-refresh'],
    rules: {
        ...(baseConfig.rules || {}),
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
})
