import { createMutation, createQuery as createTanstackQuery, QueryClient } from "@tanstack/svelte-query";
import type { ClientRequest, ClientRequestOptions } from "hono/client";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface QueryError {
    message: string;
}

const queryKey = (url: URL) => [
    ...url.pathname.split("/").filter(s => s.length > 0),
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
        queryKey: ["get", ...queryKey(endpoint.$url())],
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
    input?: In extends unknown ? undefined : In;
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
            else throw data as QueryError;
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
