import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { snackbar } from "@/shared/components/snackbar/emitter";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const err = error as AxiosErrorLike;
      snackbar.error(
        err.response?.data?.message ?? err.message ?? "Something went wrong",
      );
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      const err = error as AxiosErrorLike;
      snackbar.error(
        err.response?.data?.message ?? err.message ?? "Something went wrong",
      );
    },
  }),

  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
