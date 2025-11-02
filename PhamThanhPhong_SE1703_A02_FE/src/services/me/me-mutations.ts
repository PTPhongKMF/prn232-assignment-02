import { useMutation } from "@tanstack/solid-query";
import * as v from "valibot";
import { httpClient } from "../http-client.ts";

const UpdateInfoRequestSchema = v.object({
  accountName: v.string(),
  accountEmail: v.string(),
});

const ChangePasswordRequestSchema = v.object({
  currentPassword: v.string(),
  newPassword: v.string(),
});

export type UpdateInfoRequest = v.InferOutput<typeof UpdateInfoRequestSchema>;
export type ChangePasswordRequest = v.InferOutput<typeof ChangePasswordRequestSchema>;

export function createUpdateInfoMutation() {
  return useMutation<void, Error, UpdateInfoRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(UpdateInfoRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Update Info Input.");
      await httpClient.patch("odata/me/info", { json: req });
    },
  }));
}

export function createChangePasswordMutation() {
  return useMutation<void, Error, ChangePasswordRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(ChangePasswordRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Change Password Input.");
      await httpClient.patch("odata/me/password", { json: req });
    },
  }));
}


