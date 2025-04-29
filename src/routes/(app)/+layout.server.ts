import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { dehydrated, user } }) => {
    return {
        dehydrated,
        user,
    };
};
