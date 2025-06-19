import type { PageServerLoad } from "./$types";

import { PERMISSION_TEAM_OWNER, PERMISSION_UPDATE_TEAM } from "$lib/schema/permission";
import { userHasPermissionInTeam } from "$srv/access/team";

export const load: PageServerLoad = async (event) => {
    return {
        userCanUpdate: await userHasPermissionInTeam(
            event.locals.user.id,
            event.params.teamId,
            PERMISSION_UPDATE_TEAM
        ),
        userIsOwner: await userHasPermissionInTeam(
            event.locals.user.id,
            event.params.teamId,
            PERMISSION_TEAM_OWNER
        )
    }
}
