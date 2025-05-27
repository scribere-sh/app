import { describe, expect, test } from "vitest";

import { generateUid } from "$lib/uid";
import { match } from "../params/uid";

describe("UID Generation", () => {
    test(
        "matcher lines up",
        {
            repeats: 200,
        },
        () => {
            const uid = generateUid();
            console.log(uid);
            expect(match(uid)).toEqual(true);
        },
    );
});
