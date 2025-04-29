import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { readable } from "svelte/store";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

/**
 * Shamelessly stolen from
 *
 * https://github.com/ap0nia/eden-query/issues/85
 *
 * written by my mate Bruno
 *
 * @param cb - fetcher for the reactive args
 * @returns an object that tanstack query likes and will react to
 */
export const reactiveQueryArgs = <T>(cb: () => T) => {
    return readable(cb(), (set) => {
        $effect.pre(() => {
            set(cb());
        });
    });
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
