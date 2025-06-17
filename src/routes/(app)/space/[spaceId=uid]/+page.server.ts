import type { PageServerLoad } from "./$types";

import { redirect, error } from "@sveltejs/kit";

import { db } from "$srv/db";
import { spacesTable } from "$srv/db/schema/space";
import { eq } from "drizzle-orm";
import { route } from "$lib/routes";

export const load: PageServerLoad = async ({ params }) => {
    const [spaceHomepageQuery] = await db.query
        .select({
            homepage: spacesTable.homepage
        })
        .from(spacesTable)
        .where(eq(
            spacesTable.id,
            params.spaceId
        ));

    if (!spaceHomepageQuery) error(404, { message: "space not found" });

    redirect(
        307,
        route('/space/[spaceId=uid]/page/[pageId=uid]', { spaceId: params.spaceId, pageId: spaceHomepageQuery.homepage })
    );
};
