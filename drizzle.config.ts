import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/server/db/schema/*",
    verbose: true,
    strict: true,
    dialect: "sqlite",
});
