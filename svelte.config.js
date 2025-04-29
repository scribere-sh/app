import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import { resolve } from "path";

/** @type { import('@sveltejs/kit').Config } */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            platformProxy: {
                configPath: "./wrangler.jsonc",
            },
        }),
        alias: {
            $ui: resolve("./src/lib/components/ui"),
            $blk: resolve("./src/lib/components/blocks"),

            $srv: resolve("./src/lib/server"),
            $tb: resolve("./src/lib/server/db/schema"),
        },
        version: {
            pollInterval: 30_000,
        },
        csp: {
            mode: "nonce",
        },
    },
};

export default config;
