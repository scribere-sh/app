/**
 * @filename: lint-staged.config.js
 * @type { import('lint-staged').Configuration }
 */
export default {
	'**/*.{js,ts,svelte,css,html,json}': ['prettier --write .', 'eslint .']
};
