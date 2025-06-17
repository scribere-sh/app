/* eslint-disable no-control-regex */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

/**
 * Schedule the {@link cb | callback} to run after the set {@link durationMs | duration},
 * call the returned function to start the run.
 *
 * Calling the returned function multiple times within the set {@link durationMs | duration}
 * will cause it to run ONCE {@link durationMs | duration} ms after the last call.
 *
 * This allows a callback to be assigned to multiple event handlers without calling it on
 * event single individual one.
 *
 * @see https://www.geeksforgeeks.org/debouncing-in-javascript
 *
 * @param cb - The callback
 * @param durationMs - the buffer duration (in milliseconds)
 * @returns the debounced function to be used in event handlers
 */
export const debounce = <T>(cb: (v: T) => void, durationMs: number): (v: T) => void => {
    let timer: ReturnType<typeof setTimeout>;

    return (v: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb(v), durationMs);
    };
};

/**
 * Given a string, generate a new string between 1 and 3 letters long,
 * this string will be uppercase and can be used as fallback text
 * within an avatar.
 *
 * @param name - the string to be treated as a name
 * @returns a string of up to 3 letters long that can be used as initials
 */
export const initials = (name: string) => name.split(" ").slice(0, 3).map(s => s[0].toUpperCase()).join("");

export const EMAIL_REGEX =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

export const censorEmail = (email: string): string => {
    const atSymbolPos = email.indexOf("@");

    return email[0]
        .concat(
            "*".repeat(atSymbolPos - 1),
        )
        .concat(
            email.substring(atSymbolPos),
        );
};

export type Unpack<T> = {
    [K in keyof T]: T[K] extends object ? Unpack<T[K]> : T[K];
};
