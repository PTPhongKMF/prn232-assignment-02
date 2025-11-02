import { useMutation } from "@tanstack/solid-query";
import * as v from "valibot";
import type { CreateNewsRequest } from "../../schemas/news.ts";
import { CreateNewsRequestSchema } from "../../schemas/news.ts";
import { httpClient } from "../http-client.ts";

export function createCreateNewsMutation() {
  return useMutation<void, Error, CreateNewsRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(CreateNewsRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Create News Input.");

      await httpClient.post("odata/newsarticles", {
        json: req,
      });
    },
  }));
}

export function createUpdateNewsMutation() {
  return useMutation<void, Error, { id: number; data: CreateNewsRequest }>(
    () => ({
      mutationFn: async ({ id, data }) => {
        const valid = v.safeParse(CreateNewsRequestSchema, data);
        if (!valid.success) throw new Error("Invalid Update News Input.");

        await httpClient.put(`odata/newsarticles(${id})`, {
          json: data,
        });
      },
    }),
  );
}

export function createDeleteNewsMutation() {
  return useMutation<void, Error, number>(() => ({
    mutationFn: async (id) => {
      await httpClient.delete(`odata/newsarticles(${id})`);
    },
  }));
}



