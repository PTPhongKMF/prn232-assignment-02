import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import {
  type AccountsResponse,
  AccountsResponseSchema,
} from "../../schemas/user.ts";
import { httpClient } from "../http-client.ts";
import type { Accessor } from "solid-js";

export function createAccountsQuery(
  searchStr: Accessor<string>,
  isODataMode: Accessor<boolean>,
) {
  return useQuery<AccountsResponse, Error>(() => ({
    queryKey: ["accounts", searchStr(), isODataMode()],
    queryFn: async () => {
      let url = "odata/systemaccounts";
      const search = searchStr();
      const isOData = isODataMode();

      if (search) {
        if (isOData) {
          url += `?${search}`;
        } else {
          url += `?$filter=contains(AccountName,'${search}')`;
        }
      }

      const res = await httpClient.get(url).json();
      return v.parse(AccountsResponseSchema, res);
    },
  }));
}
