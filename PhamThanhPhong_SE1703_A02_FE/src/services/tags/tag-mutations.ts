import { useMutation } from "@tanstack/solid-query";
import * as v from "valibot";
import type { CreateTagRequest, UpdateTagRequest } from "../../schemas/tag.ts";
import {
  CreateTagRequestSchema,
  UpdateTagRequestSchema,
} from "../../schemas/tag.ts";
import { httpClient } from "../http-client.ts";

export function createCreateTagMutation() {
  return useMutation<void, Error, CreateTagRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(CreateTagRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Create Tag Input.");

      await httpClient.post("odata/tags", { json: req });
    },
  }));
}

export function createUpdateTagMutation() {
  return useMutation<void, Error, { id: number; data: UpdateTagRequest }>(
    () => ({
      mutationFn: async ({ id, data }) => {
        const valid = v.safeParse(UpdateTagRequestSchema, data);
        if (!valid.success) throw new Error("Invalid Update Tag Input.");

        await httpClient.put(`odata/tags(${id})`, { json: data });
      },
    })
  );
}

export function createDeleteTagMutation() {
  return useMutation<void, Error, number>(() => ({
    mutationFn: async (id) => {
      await httpClient.delete(`odata/tags(${id})`);
    },
  }));
}
