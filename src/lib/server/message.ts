import { getRequestEvent } from "$app/server";

import { decodeBase64urlIgnorePadding, encodeBase64urlNoPadding } from "@oslojs/encoding";
import { type } from "arktype";

const MESSAGE_COOKIE_NAME = "__message";

const messageType = type({
    type: "'info' | 'warning' | 'error'",
    content: "string < 50",
});

export type Message = typeof messageType.infer;

export type MessageType = Message["type"];

export const setMessage = (msg: Message) => {
    const { cookies } = getRequestEvent();

    const cookieString = encodeBase64urlNoPadding(new TextEncoder().encode(JSON.stringify({
        type: msg.type,
        content: msg.content.substring(0, 50),
    })));

    cookies.set(
        MESSAGE_COOKIE_NAME,
        cookieString,
        {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: import.meta.env.PROD,
        },
    );
};

export const getMessage: () => Message | null = () => {
    const { cookies } = getRequestEvent();

    const cookie = cookies.get(MESSAGE_COOKIE_NAME);

    if (!cookie) return null;

    try {
        const decodedCookie = new TextDecoder().decode(decodeBase64urlIgnorePadding(cookie));

        const cookieValue = JSON.parse(decodedCookie);

        const validatedMessageResult = messageType(cookieValue);

        if (validatedMessageResult instanceof type.errors) {
            console.warn("message is invalid");
            return null;
        } else {
            return validatedMessageResult;
        }
    } catch (e) {
        console.warn("failed to deserialise message", e);
        return null;
    }
};

export const clearMessage = () => {
    const { cookies } = getRequestEvent();

    cookies.delete(MESSAGE_COOKIE_NAME, { path: "/" });
};
