/**
 * @filename: lint-staged.config.js
 * @type { import('lint-staged').Configuration }
 */
export default {
    "**/*.{js,ts,tsx,svelte,css,html,json}": ["dprint fmt"],
};
