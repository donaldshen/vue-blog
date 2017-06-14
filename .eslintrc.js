module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import",
        'html'
    ],
    env: {
      browser: true,
      node: true
    },
    root: true,
    rules: {
      semi: ['error', 'never'],
      'no-console': 'off',
      'no-else-return': 'off',
      'no-param-reassign': ['error', {
        props: false
      }],
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-expressions': ['error', {
        allowShortCircuit: true
      }]
    },
    globals: {
      $: false
    }
};
