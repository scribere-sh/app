import type { LayoutServerLoad } from "./$types";

import { clearMessage, getMessage } from "$srv/message";

export const load: LayoutServerLoad = () => {
    const message = getMessage();

    if (message) clearMessage();

    return {
        message,
    };
};
