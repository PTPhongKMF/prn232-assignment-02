import { useMutation } from "@tanstack/solid-query";
import * as v from "valibot";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../schemas/category.ts";
import {
  CreateCategoryRequestSchema,
  UpdateCategoryRequestSchema,
} from "../../schemas/category.ts";
import { httpClient } from "../http-client.ts";

export function createCreateCategoryMutation() {
  return useMutation<void, Error, CreateCategoryRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(CreateCategoryRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Create Category Input.");

      await httpClient.post("odata/categories", {
        json: req,
      });
    },
  }));
}

export function createUpdateCategoryMutation() {
  return useMutation<void, Error, { id: number; data: UpdateCategoryRequest }>(
    () => ({
      mutationFn: async ({ id, data }) => {
        const valid = v.safeParse(UpdateCategoryRequestSchema, data);
        if (!valid.success) throw new Error("Invalid Update Category Input.");

        await httpClient.put(`odata/categories(${id})`, {
          json: data,
        });
      },
    }),
  );
}

export function createDeleteCategoryMutation() {
  return useMutation<void, Error, number>(() => ({
    mutationFn: async (id) => {
      await httpClient.delete(`odata/categories(${id})`);
    },
  }));
}
