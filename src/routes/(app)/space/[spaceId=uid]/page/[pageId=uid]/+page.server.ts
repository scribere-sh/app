import { PERMISSION_WRITE_SPACE } from "$lib/schema/permission";
import { userHasPermissionForSpace } from "$srv/access/space";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    return {
        canEdit: await userHasPermissionForSpace(locals.user.id, params.spaceId, PERMISSION_WRITE_SPACE)
    };
}
