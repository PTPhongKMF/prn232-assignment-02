import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { httpClient } from "../http-client.ts";
import {
  type CategoriesResponse,
  CategoriesResponseSchema,
} from "../../schemas/category.ts";

export function createCategoriesQuery(
  searchStr: Accessor<string>,
  isODataMode: Accessor<boolean>,
) {
  return useQuery<CategoriesResponse, Error>(() => ({
    queryKey: ["categories", searchStr(), isODataMode()],
    queryFn: async () => {
      let url = "odata/categories";
      const search = searchStr();
      const isOData = isODataMode();

      if (search) {
        if (isOData) {
          url += `?${search}`;
        } else {
          url += `?$filter=contains(CategoryName,'${search}')`;
        }
      }

      const res = await httpClient.get(url).json();
      return v.parse(CategoriesResponseSchema, res);
    },
  }));
}


