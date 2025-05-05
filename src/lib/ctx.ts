import { getContext, setContext } from "svelte";

import type { Session } from "./schema/session";
import type { User } from "./schema/user";

const USER_CONTEXT_KEY = "$$_user";
const SESSION_CONTEXT_KEY = "$$_session";

export const setLayoutContext = (props: {
    user: User;
    session: Session;
}) => {
    setContext(USER_CONTEXT_KEY, props.user);
    setContext(SESSION_CONTEXT_KEY, props.session);
};

export const useUser = () => getContext<User>(USER_CONTEXT_KEY);
export const useSession = () => getContext<Session>(SESSION_CONTEXT_KEY);
