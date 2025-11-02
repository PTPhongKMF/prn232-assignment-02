import * as v from "valibot";
import { useQuery } from "@tanstack/solid-query";
import type { StatisticResponse } from "../schemas/statistic.ts";
import { StatisticResponseSchema } from "../schemas/statistic.ts";
import { httpClient } from "./http-client.ts";
import type { Accessor } from "solid-js";

export function createStatisticQuery(
  startDate: Accessor<string>,
  endDate: Accessor<string>,
) {
  return useQuery<StatisticResponse, Error>(() => ({
    queryKey: ["statistics"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate()) {
        params.set("startDate", new Date(startDate()).toISOString());
      }
      if (endDate()) params.set("endDate", new Date(endDate()).toISOString());

      console.log(startDate());
      console.log(endDate());

      const queryString = params.toString();
      const url = queryString
        ? `odata/newsstatistics?${queryString}`
        : "odata/newsstatistics";

      const res = await httpClient.get(url).json();
      return v.parse(StatisticResponseSchema, res);
    },
    enabled: false,
  }));
}
