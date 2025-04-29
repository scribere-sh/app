import ElysiaKit from "$srv/api/elysia-kit";
import { Elysia, t } from "elysia";

export default new Elysia({
    aot: false,
})
    .use(ElysiaKit)
    /**
     * # GET /api/ping
     *
     * A basic ping handler to test stuff
     */
    .get(
        "/ping",
        ({ set, user }) => {
            set.status = "OK";

            return user;
        },
        {
            response: t.Object({
                displayName: t.String(),
                handle: t.String(),
                id: t.String(),
            }),
        },
    );
