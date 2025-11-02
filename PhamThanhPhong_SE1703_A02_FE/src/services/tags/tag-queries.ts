import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { httpClient } from "../http-client.ts";
import {
  TagsResponseSchema,
  type TagsResponse,
} from "../../schemas/tag.ts";

export function createTagsQuery() {
  return useQuery<TagsResponse, Error>(() => ({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await httpClient.get("odata/tags").json();
      return v.parse(TagsResponseSchema, res);
    },
  }));
}

export function createTagsQueryWithSearch(
  searchStr: Accessor<string>,
  isODataMode: Accessor<boolean>,
) {
  return useQuery<TagsResponse, Error>(() => ({
    queryKey: ["tags", searchStr(), isODataMode()],
    queryFn: async () => {
      let url = "odata/tags";
      const search = searchStr();
      const isOData = isODataMode();

      if (search) {
        if (isOData) {
          url += `?${search}`;
        } else {
          url += `?$filter=contains(TagName,'${search}')`;
        }
      }

      const res = await httpClient.get(url).json();
      return v.parse(TagsResponseSchema, res);
    },
  }));
}


