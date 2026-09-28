import { type AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await apiClient.get<T>(url, config);
    return data;
  },

  post: async <T, P = unknown>(
    url: string,
    payload?: P,
    config?: AxiosRequestConfig,
  ) => {
    const { data } = await apiClient.post<T>(url, payload, config);
    return data;
  },

  put: async <T, P = unknown>(
    url: string,
    payload?: P,
    config?: AxiosRequestConfig,
  ) => {
    const { data } = await apiClient.put<T>(url, payload, config);
    return data;
  },

  patch: async <T, P = unknown>(
    url: string,
    payload?: P,
    config?: AxiosRequestConfig,
  ) => {
    const { data } = await apiClient.patch<T>(url, payload, config);
    return data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await apiClient.delete<T>(url, config);
    return data;
  },
};
