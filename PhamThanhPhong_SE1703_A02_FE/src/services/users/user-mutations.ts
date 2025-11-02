import { useMutation } from "@tanstack/solid-query";
import * as v from "valibot";
import { httpClient } from "../http-client.ts";
import {
  CreateAccountRequestSchema,
  LoginApiResponseSchema,
  LoginRequestSchema,
  UpdateAccountRequestSchema,
} from "../../schemas/user.ts";
import type {
  CreateAccountRequest,
  LoginApiResponse,
  LoginRequest,
  UpdateAccountRequest,
} from "../../schemas/user.ts";

export function createLoginMutation() {
  return useMutation<LoginApiResponse, Error, LoginRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(LoginRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Login Input.");

      const res = await httpClient.post("odata/systemaccounts/login", {
        json: {
          accountEmail: req.email,
          accountPassword: req.password,
        },
      }).json();

      return v.parse(LoginApiResponseSchema, res);
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  }));
}

export function createCreateAccountMutation() {
  return useMutation<void, Error, CreateAccountRequest>(() => ({
    mutationFn: async (req) => {
      const valid = v.safeParse(CreateAccountRequestSchema, req);
      if (!valid.success) throw new Error("Invalid Create Account Input.");

      await httpClient.post("odata/systemaccounts", {
        json: req,
      });
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      console.log("Account created successfully");
    },
  }));
}

export function createUpdateAccountMutation() {
  return useMutation<void, Error, { id: number; data: UpdateAccountRequest }>(
    () => ({
      mutationFn: async ({ id, data }) => {
        const valid = v.safeParse(UpdateAccountRequestSchema, data);
        if (!valid.success) throw new Error("Invalid Update Account Input.");

        await httpClient.put(`odata/systemaccounts(${id})`, {
          json: data,
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onSuccess: () => {
        console.log("Account updated successfully");
      },
    })
  );
}

export function createDeleteAccountMutation() {
  return useMutation<void, Error, number>(() => ({
    mutationFn: async (id) => {
      await httpClient.delete(`odata/systemaccounts(${id})`);
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      console.log("Account deleted successfully");
    },
  }));
}
