import { Ulid } from "id128";
import { describe, expect, test } from "vitest";

describe("ULID Generation", () => {
    test("toCanonical Produces Valid ULID String", () => {
        const ulid = Ulid.generate();
        const canonical = ulid.toCanonical();

        expect(canonical.length).toEqual(26);

        expect(canonical).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });
});
