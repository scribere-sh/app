import { createMutation, createQuery as createTanstackQuery, QueryClient } from "@tanstack/svelte-query";
import type { ClientRequest, ClientRequestOptions } from "hono/client";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface QueryError {
    message: string;
}

const queryKey = (url: URL, other: Record<string, unknown> = {}) => [
    ...url.pathname.split("/").filter(s => s.length > 0),
    ...Object.values(other).map(v => JSON.stringify(v)).filter(s => s.length > 0),
];

export const prefetchQuery = <In, Out>({ client, endpoint, input, options }: {
    client: QueryClient;
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    input?: In extends unknown ? undefined : In;
    options?: ClientRequestOptions;
}) => {
    return client.prefetchQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", ...queryKey(endpoint.$url(), input ? input : {})],
        queryFn: async () => {
            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data as QueryError;
        },
    });
};

export const createQuery = <In, Out>({ endpoint, initialData, input, options }: {
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    initialData?: Out;
    input?: object extends In ? undefined : In;
    options?: ClientRequestOptions;
}) => {
    return createTanstackQuery({
        // @ts-expect-error - shut up and let me cook
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", ...queryKey(endpoint.$url(input))],
        initialData,
        queryFn: async () => {
            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data as QueryError;
        },
    });
};

export const createBlobQuery = <In, Out>({ endpoint, input, options }: {
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "body";
            status: ContentfulStatusCode;
        };
    }>;
    input?: object extends In ? undefined : In;
    options?: ClientRequestOptions;
}) => {
    return createTanstackQuery({
        // @ts-expect-error - shut up and let me cook
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", "bin", ...queryKey(endpoint.$url(input))],
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 60 * 60 * 1000,
        queryFn: async (ctx) => {
            const cachedObjects = ctx.client.getQueryCache().findAll({
                queryKey: ctx.queryKey,
            });

            cachedObjects.forEach(obj => {
                if (obj.state.data) {
                    // prevent a "memory leak"-esque situation
                    console.debug(`Freeing Cached Object - ${(obj.state.data as string).split("/")[3]}`);
                    URL.revokeObjectURL(obj.state.data as string);
                }
            });

            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            if (!response.ok) throw await response.json();

            const responseBlob = await response.blob();
            return URL.createObjectURL(responseBlob);
        },
    });
};

export const createPutMutation = <In, Out>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $put: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["put", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$put(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data as QueryError;
        },
    });
};

export const createPostMutation = <In, Out>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $post: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["post", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$post(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data as QueryError;
        },
    });
};

export const createDeleteMutation = <In, Out>({ endpoint, options }: {
    endpoint: ClientRequest<{
        $delete: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    }>;
    options?: ClientRequestOptions;
}) => {
    return createMutation({
        mutationKey: ["delete", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$delete(variables, options);
            const data = await response.json();
            if (response.ok) return data;
            else throw data as QueryError;
        },
    });
};

export const invalidateQuery = (client: QueryClient, queryKey: string[]) => {
    return client.invalidateQueries({
        queryKey,
    });
};
