import {
    createMutation,
    type CreateMutationOptions,
    createQuery as createTanstackQuery,
    type CreateQueryOptions,
    type FetchQueryOptions,
    QueryClient,
} from "@tanstack/svelte-query";
import type { ClientRequest, ClientRequestOptions } from "hono/client";
import type { ResponseFormat } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";

export interface QueryError {
    name: string;
    message: string;
}

const queryKey = (url: URL, other: Record<string, unknown> = {}) => [
    ...url.pathname.split("/").filter(s => s.length > 0),
    ...Object.values(other).map(v => JSON.stringify(v)).filter(s => s.length > 0),
];

export const prefetchQuery = <In, Out, Code extends StatusCode>({ client, endpoint, input, options, ...config }: {
    client: QueryClient;
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: Code;
        };
    }>;
    input?: In extends unknown ? undefined : In;
    options?: ClientRequestOptions;
} & Omit<FetchQueryOptions<Out, QueryError, In>, "queryKey" | "queryFn">) => {
    return client.prefetchQuery({
        ...config,
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

export const createQuery = <In, Out, Code extends StatusCode>({ endpoint, initialData, input, options, ...config }: {
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "json";
            status: Code;
        };
    }>;
    initialData?: Out;
    input?: object extends In ? undefined : In;
    options?: ClientRequestOptions;
} & Omit<CreateQueryOptions<Out, QueryError>, "queryFn" | "queryKey">) => {
    return createTanstackQuery<Out, QueryError>({
        ...config,
        // @ts-expect-error - shut up and let me cook
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["get", ...queryKey(endpoint.$url(input))],
        initialData,
        queryFn: async () => {
            // @ts-expect-error I don't understand this at all
            const response = await endpoint.$get(input, options);
            const data = await response.json();
            if (response.ok) return data as Out;
            else throw data as QueryError;
        },
    });
};

export const createBlobQuery = <In, Out, Code extends StatusCode>({ endpoint, input, options, ...config }: {
    endpoint: ClientRequest<{
        $get: {
            input: In;
            output: Out;
            outputFormat: "body";
            status: Code;
        };
    }>;
    input?: object extends In ? undefined : In;
    options?: ClientRequestOptions;
} & Omit<CreateQueryOptions<string, QueryError>, "queryFn" | "queryKey">) => {
    return createTanstackQuery<string, QueryError>({
        ...config,
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

export const createPutMutation = <In, Out, Code extends StatusCode, Fmt extends ResponseFormat>(
    { endpoint, options, ...config }: {
        endpoint: ClientRequest<{
            $put: {
                input: In;
                output: Out;
                outputFormat: Fmt;
                status: Code;
            };
        }>;
        options?: ClientRequestOptions;
    } & Omit<CreateMutationOptions<Out, QueryError, In>, "mutationFn" | "mutationKey">,
) => {
    return createMutation({
        ...config,
        mutationKey: ["put", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$put(variables, options);
            const data = await response.json();
            if (!response.ok) throw data as QueryError;
            return data as Out;
        },
    });
};

export const createPostMutation = <In, Out, Code extends StatusCode, Fmt extends ResponseFormat>(
    { endpoint, options, ...config }: {
        endpoint: ClientRequest<{
            $post: {
                input: In;
                output: Out;
                outputFormat: Fmt;
                status: Code;
            };
        }>;
        options?: ClientRequestOptions;
        config?: Omit<CreateMutationOptions, "mutationFn" | "mutationKey">;
    } & Omit<CreateMutationOptions<Out, QueryError, In>, "mutationFn" | "mutationKey">,
) => {
    return createMutation<Out, QueryError, In>({
        ...config,
        mutationKey: ["post", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$post(variables, options);
            const data = await response.json();
            if (!response.ok) throw data as QueryError;
            return data as Out;
        },
    });
};

export const createDeleteMutation = <In, Out, Code extends StatusCode, Fmt extends ResponseFormat>(
    { endpoint, options, ...config }: {
        endpoint: ClientRequest<{
            $delete: {
                input: In;
                output: Out;
                outputFormat: Fmt;
                status: Code;
            };
        }>;
        options?: ClientRequestOptions;
    } & Omit<CreateMutationOptions<Out, QueryError, In>, "mutationFn" | "mutationKey">,
) => {
    return createMutation<Out, QueryError, In>({
        ...config,
        mutationKey: ["delete", ...queryKey(endpoint.$url())],
        mutationFn: async (variables: In) => {
            const response = await endpoint.$delete(variables, options);
            const data = await response.json();
            if (!response.ok) throw data as QueryError;
            return data as Out;
        },
    });
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const invalidateQuery = (client: QueryClient, endpoint: ClientRequest<{}>) => {
    return client.invalidateQueries({
        queryKey: ["get", ...queryKey(endpoint.$url())],
    });
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const invalidateBlobQuery = (client: QueryClient, endpoint: ClientRequest<{}>) => {
    return client.invalidateQueries({
        queryKey: ["get", "bin", ...queryKey(endpoint.$url())],
    });
};
