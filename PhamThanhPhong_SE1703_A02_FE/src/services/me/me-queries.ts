import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import { httpClient } from "../http-client.ts";

const MeResponseSchema = v.object({
  statusCode: v.number(),
  message: v.string(),
  data: v.object({
    accountId: v.number(),
    accountName: v.nullable(v.string()),
    accountEmail: v.string(),
    accountRole: v.number(),
  }),
});

export type MeResponse = v.InferOutput<typeof MeResponseSchema>;

export function createMeQuery() {
  return useQuery<MeResponse, Error>(() => ({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await httpClient.get("odata/me").json();
      return v.parse(MeResponseSchema, res);
    },
  }));
}
