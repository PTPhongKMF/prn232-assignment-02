import * as v from "valibot";
import ky from "ky";
import { ApiErrorResponseSchema } from "../schemas/api-response.ts";
import { user } from "../stores/user-store.ts";

export const httpClient = ky.extend({
  prefixUrl: "https://localhost:5566/",
  hooks: {
    beforeRequest: [
      (request) => {
        if (user()) {
          request.headers.set("Authorization", `Bearer ${user()?.token}`);
        }
      },
    ],
    beforeError: [
      async (err) => {
        const resBody = await err.response.json();

        const result = v.safeParse(ApiErrorResponseSchema, resBody);
        if (result.success) {
          err.message = `${result.output.statusCode}: ${result.output.message}`;
          return err;
        }

        return err;
      },
    ],
  },
});
