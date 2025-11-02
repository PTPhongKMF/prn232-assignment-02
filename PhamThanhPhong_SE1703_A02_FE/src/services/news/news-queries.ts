import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { httpClient } from "../http-client.ts";
import {
  type NewsArticlesResponse,
  NewsArticlesResponseSchema,
} from "../../schemas/news.ts";
import { user } from "../../stores/user-store.ts";

function isPrivilegedRole(role?: number) {
  return role === 1 || role === 3;
}

export function createNewsArticlesQuery(
  searchStr: Accessor<string>,
  isODataMode: Accessor<boolean>,
) {
  return useQuery<NewsArticlesResponse, Error>(() => ({
    queryKey: [
      "news-articles",
      searchStr(),
      isODataMode(),
      user()?.accountRole,
    ],
    queryFn: async () => {
      const role = user()?.accountRole;
      let url = isPrivilegedRole(role)
        ? "odata/newsarticles"
        : "odata/publicnewsarticles";

      const search = searchStr();
      const isOData = isODataMode();

      url += isOData ? "" : "?$expand=Tags";

      if (search) {
        if (isOData) {
          url += `?${search}`;
        } else {
          url += `&$filter=contains(NewsTitle,'${search}')`;
        }
      }

      const res = await httpClient.get(url).json();
      return v.parse(NewsArticlesResponseSchema, res);
    },
  }));
}

export function createNewsByCreatorQuery(
  creatorId: Accessor<number | undefined>,
  searchStr: Accessor<string>,
) {
  return useQuery<NewsArticlesResponse, Error>(() => ({
    queryKey: ["news-articles-by-me", creatorId(), searchStr()],
    queryFn: async () => {
      const id = creatorId();
      if (!id && id !== 0) throw new Error("Missing creator id");
      let url = `odata/newsarticles?$expand=Tags&$filter=CreatedById eq ${id}`;
      const search = searchStr();
      if (search) {
        url += ` and contains(NewsTitle,'${search}')`;
      }
      const res = await httpClient.get(url).json();
      return v.parse(NewsArticlesResponseSchema, res);
    },
    enabled: creatorId() !== undefined,
  }));
}
