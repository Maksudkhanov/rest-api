module.exports = {
	parser: '@typescript-eslint/parser',

	plugins: ['@typescript-eslint', 'prettier'],
	extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
	rules: {
		// Overwrite rules specified from the extended configs e.g.
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],

		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-empty-function': 'off',
		'prefer-const': 'warn',
		'no-console': 'error',
	},
	overrides: [
		{
			// enable the rule specifically for TypeScript files
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': ['error'],
			},
		},
	],
};
