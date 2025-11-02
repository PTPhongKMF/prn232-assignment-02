import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { createStatisticQuery } from "../services/statistic-queries.ts";

export default function Statistic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = createSignal<string>("");
  const [endDate, setEndDate] = createSignal<string>("");

  const statisticQuery = createStatisticQuery(startDate, endDate);

  onMount(() => {
    const urlStartDate = Array.isArray(searchParams.startDate)
      ? searchParams.startDate[0]
      : searchParams.startDate;
    const urlEndDate = Array.isArray(searchParams.endDate)
      ? searchParams.endDate[0]
      : searchParams.endDate;

    if (urlStartDate) setStartDate(urlStartDate);
    if (urlEndDate) setEndDate(urlEndDate);
  });

  createEffect(() => {
    const params = new URLSearchParams();
    params.set("startDate", startDate());
    params.set("endDate", endDate());

    setSearchParams(Object.fromEntries(params.entries()));
  });

  const handleFetch = () => {
    statisticQuery.refetch();
  };

  return (
    <div class="py-6 px-16 mt-12">
      <div class="mb-6 w-full">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">News Statistics</h1>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate()}
                onInput={(e) => setStartDate(e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition cursor-pointer"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate()}
                onInput={(e) => setEndDate(e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition cursor-pointer"
              />
            </div>
            <button
              onClick={handleFetch}
              disabled={statisticQuery.isFetching}
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={statisticQuery.isFetching}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                </div>
              </Show>
              {statisticQuery.isFetching ? "Fetching..." : "Fetch Statistics"}
            </button>
          </div>
        </div>

        <Show when={statisticQuery.error}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {statisticQuery.error?.message || "Failed to fetch statistics"}
          </div>
        </Show>

        <Show when={statisticQuery.data}>
          {(data) => (
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Total News
                    <span class="text-sm font-normal text-gray-500 ml-2">
                      (count)
                    </span>
                  </h3>
                  <p class="text-3xl font-bold text-blue-600">
                    {data().data.totalNewsCount}
                  </p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Total Authors
                    <span class="text-sm font-normal text-gray-500 ml-2">
                      (count)
                    </span>
                  </h3>
                  <p class="text-3xl font-bold text-green-600">
                    {data().data.totalAuthorsCount}
                  </p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Categories
                    <span class="text-sm font-normal text-gray-500 ml-2">
                      (count)
                    </span>
                  </h3>
                  <p class="text-3xl font-bold text-purple-600">
                    {data().data.categoryStats.length}
                  </p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Tags
                    <span class="text-sm font-normal text-gray-500 ml-2">
                      (count)
                    </span>
                  </h3>
                  <p class="text-3xl font-bold text-orange-600">
                    {data().data.tagStats.length}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Author Statistics
                      <span class="text-sm font-normal text-gray-500 ml-2">
                        (count)
                      </span>
                    </h3>
                  </div>
                  <div class="p-4">
                    <div class="space-y-3">
                      <For each={data().data.authorStats}>
                        {(author) => (
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-900">
                              {author.authorName}
                            </span>
                            <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {author.articleCount}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Category Statistics
                      <span class="text-sm font-normal text-gray-500 ml-2">
                        (count)
                      </span>
                    </h3>
                  </div>
                  <div class="p-4">
                    <div class="space-y-3">
                      <For each={data().data.categoryStats}>
                        {(category) => (
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-900">
                              {category.categoryName}
                            </span>
                            <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {category.articleCount}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Tag Statistics
                      <span class="text-sm font-normal text-gray-500 ml-2">
                        (count)
                      </span>
                    </h3>
                  </div>
                  <div class="p-4 max-h-64 overflow-y-auto">
                    <div class="space-y-3">
                      <For each={data().data.tagStats}>
                        {(tag) => (
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-900">
                              {tag.tagName}
                            </span>
                            <span class="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              {tag.articleCount}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900">
                    News Articles ({data().data.newsList.length})
                  </h3>
                </div>
                <div class="p-4">
                  <div class="overflow-auto max-h-96">
                    <div class="space-y-4">
                      <For each={data().data.newsList}>
                        {(news) => (
                          <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                              <h4 class="text-sm font-semibold text-gray-900 line-clamp-2">
                                {news.newsTitle}
                              </h4>
                              <span class="text-xs text-gray-500 ml-2 shrink-0">
                                #{news.newsArticleId}
                              </span>
                            </div>
                            <p class="text-sm text-gray-600 mb-2 line-clamp-2">
                              {news.headline}
                            </p>
                            <div class="flex justify-between items-center text-xs text-gray-500">
                              <span>By {news.authorName}</span>
                              <span>{news.categoryName}</span>
                              <span>
                                {new Date(news.createdDate)
                                  .toLocaleDateString()}
                              </span>
                            </div>
                            <Show when={news.tags.length > 0}>
                              <div class="flex flex-wrap gap-1 mt-2">
                                <For each={news.tags}>
                                  {(tag) => (
                                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {tag.tagName}
                                    </span>
                                  )}
                                </For>
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
