import * as v from "valibot";
import { createApiResponseSchema } from "./api-response.ts";

export const LoginRequestSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
});

export const LoginResponseSchema = v.object({
  accountId: v.number(),
  accountName: v.string(),
  accountEmail: v.string(),
  accountRole: v.number(),
  token: v.string(),
  deleteable: v.boolean(),
});

export const LoginApiResponseSchema = createApiResponseSchema(
  LoginResponseSchema,
);

export const AccountSchema = v.object({
  AccountId: v.number(),
  AccountName: v.string(),
  AccountEmail: v.string(),
  AccountRole: v.number(),
  AccountPassword: v.string(),
  Token: v.nullable(v.string()),
  Deleteable: v.boolean(),
});

export const AccountsResponseSchema = v.object({
  "@odata.context": v.string(),
  value: v.array(AccountSchema),
});

export const CreateAccountRequestSchema = v.object({
  accountName: v.pipe(v.string(), v.nonEmpty()),
  accountEmail: v.pipe(v.string(), v.email()),
  accountRole: v.pipe(v.number(), v.minValue(1), v.maxValue(2)),
  accountPassword: v.pipe(v.string(), v.nonEmpty()),
});

export const UpdateAccountRequestSchema = v.object({
  accountName: v.pipe(v.string(), v.nonEmpty()),
  accountEmail: v.pipe(v.string(), v.email()),
  accountRole: v.pipe(v.number(), v.minValue(1), v.maxValue(2)),
  accountPassword: v.pipe(v.string(), v.nonEmpty()),
});

export type LoginRequest = v.InferOutput<typeof LoginRequestSchema>;
export type LoginResponse = v.InferOutput<typeof LoginResponseSchema>;
export type LoginApiResponse = v.InferOutput<typeof LoginApiResponseSchema>;

export type Account = v.InferOutput<typeof AccountSchema>;
export type AccountsResponse = v.InferOutput<typeof AccountsResponseSchema>;
export type CreateAccountRequest = v.InferOutput<
  typeof CreateAccountRequestSchema
>;
export type UpdateAccountRequest = v.InferOutput<
  typeof UpdateAccountRequestSchema
>;
