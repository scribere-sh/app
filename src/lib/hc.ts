import type { Api } from "$srv/api";
import { hc } from "hono/client";

import { createMutation, createQuery as createTanstackQuery, QueryClient } from "@tanstack/svelte-query";
import type { ClientRequest, ClientRequestOptions } from "hono/client";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const api = hc<Api>("http://localhost:5173").api;

const queryKey = (url: URL) => url.pathname.split("/").filter(s => s.length > 0);

export const prefetchQuery = <
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TInput = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TOutput = {},
>({ client, endpoint, input, options }: {
    client: QueryClient;
    endpoint: ClientRequest<{
        $get: {
            input: TInput;
            output: TOutput;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    input?: TInput extends unknown ? undefined : TInput;
    options?: ClientRequestOptions;
}) => {
    return client.prefetchQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", ...queryKey(endpoint.$url())],
        queryFn: async () => {
            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data;
        },
    });
};

export const createQuery = <
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TInput = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TOutput = {},
>({ endpoint, initialData, input, options }: {
    endpoint: ClientRequest<{
        $get: {
            input: TInput;
            output: TOutput;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    initialData?: TOutput;
    input?: TInput extends unknown ? undefined : TInput;
    options?: ClientRequestOptions;
}) => {
    return createTanstackQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", ...queryKey(endpoint.$url())],
        initialData,
        queryFn: async () => {
            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data;
        },
    });
};

export const createPutMutation = <
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TInput = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TOutput = {},
>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $put: {
            input: TInput;
            output: TOutput;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["put", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: TInput) => {
            const response = await endpoint.$put(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data;
        },
    });
};

export const createPostMutation = <
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TInput = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TOutput = {},
>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $post: {
            input: TInput;
            output: TOutput;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["post", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: TInput) => {
            const response = await endpoint.$post(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data;
        },
    });
};

export const createDeleteMutation = <
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TInput = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TOutput = {},
>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $delete: {
            input: TInput;
            output: TOutput;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["delete", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: TInput) => {
            const response = await endpoint.$delete(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data;
        },
    });
};
