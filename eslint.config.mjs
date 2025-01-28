import globals from "globals";
import pluginJs from "@eslint/js";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
			ecmaVersion: "latest",
		},
		plugins: {
			"@stylistic/js": stylisticJs,
		},
		rules: {
			"@stylistic/js/indent": ["error", "tab"],
			"@stylistic/js/linebreak-style": ["error", "unix"],
			"@stylistic/js/quotes": ["error", "double"],
			"@stylistic/js/semi": ["error", "always"],
		},
	},
];
