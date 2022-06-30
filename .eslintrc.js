require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@microsoft/spfx/no-async-await': 'off',
    '@typescript-eslint/typedef': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-bind': 'off',
    'no-empty': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@microsoft/spfx/pair-react-dom-render-unmount': 'off'
  }
};
