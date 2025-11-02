import { createEffect, createSignal, For, on, onMount, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Code, Plus, Search } from "lucide-solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/libs/shadcn-solid/Dialog.tsx";
import { user } from "../stores/user-store.ts";
import { createNewsArticlesQuery } from "../services/news/news-queries.ts";
import NewsItem from "../components/news/NewsItem.tsx";
import CreateNewsDialog from "../components/news/CreateNewsDialog.tsx";
import UpdateNewsDialog from "../components/news/UpdateNewsDialog.tsx";
import type { NewsArticle } from "../schemas/news.ts";
import {
  createDeleteNewsMutation,
} from "../services/news/news-mutations.ts";

function canManage() {
  const role = user()?.accountRole;
  return role === 1 || role === 3;
}

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchStr, setSearchStr] = createSignal("");
  const [debouncedSearchStr, setDebouncedSearchStr] = createSignal("");
  const [isODataMode, setIsODataMode] = createSignal(false);

  const [selectedArticle, setSelectedArticle] = createSignal<NewsArticle | null>(
    null,
  );

  const [updateDialogOpen, setUpdateDialogOpen] = createSignal(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [createDialogOpen, setCreateDialogOpen] = createSignal(false);

  let debounceTimer: number | undefined;
  const debouncedSearch = (value: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearchStr(value), 500);
  };

  const newsQuery = createNewsArticlesQuery(debouncedSearchStr, isODataMode);
  const deleteNewsMutation = createDeleteNewsMutation();

  onMount(() => {
    const urlSearch = Array.isArray(searchParams.search)
      ? searchParams.search[0]
      : searchParams.search;
    const urlMode = Array.isArray(searchParams.mode)
      ? searchParams.mode[0]
      : searchParams.mode;

    if (urlSearch) {
      setSearchStr(urlSearch);
      setDebouncedSearchStr(urlSearch);
    }
    if (urlMode === "odata") {
      setIsODataMode(true);
    }
  });

  createEffect(
    on(
      () => [debouncedSearchStr(), isODataMode()] as [string | undefined, boolean],
      ([search, odata]) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);

        if (odata) {
          params.set("mode", "odata");
        } else {
          params.set("mode", "normal");
        }

        setSearchParams(Object.fromEntries(params.entries()), {
          replace: true,
        });
      },
      { defer: true },
    ),
  );

  const handleSearchInput = (value: string) => {
    setSearchStr(value);
    debouncedSearch(value);
  };

  const handleCreateClick = () => {
    if (!canManage()) return;
    setCreateDialogOpen(true);
  };

  const handleUpdateClick = (article: NewsArticle) => {
    if (!canManage()) return;
    setSelectedArticle(article);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (article: NewsArticle) => {
    if (!canManage()) return;
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const id = selectedArticle()?.NewsArticleId;
    if (!id) return;
    deleteNewsMutation.mutate(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        newsQuery.refetch();
      },
    });
  };

  return (
    <div class="py-6 px-16 mt-12">
      <div class="mb-6 w-full">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">News Management</h1>

        <div class="mb-6">
          <div class="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setIsODataMode(!isODataMode())}
              class={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                isODataMode()
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              <Code size={16} />
              {isODataMode() ? "OData Mode" : "Normal Mode"}
            </button>
            <span class="text-xs text-gray-500">
              {isODataMode()
                ? "Enter OData query syntax"
                : "Search by news title"}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative flex-1">
              <Search
                size={20}
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={
                  isODataMode()
                    ? "e.g., $filter=NewsStatus eq true&$orderby=CreatedDate desc"
                    : "Search news articles..."
                }
                value={searchStr()}
                onInput={(e) => handleSearchInput(e.currentTarget.value)}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition cursor-text"
              />
            </div>

            <Show when={canManage()}>
              <button
                type="button"
                onClick={handleCreateClick}
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus size={20} />
                Create Article
              </button>
            </Show>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full table-fixed">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                    ID
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-80">
                    Title / Headline
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-[360px]">
                    Content
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-40">
                    Tags
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-40">
                    Category
                  </th>
                  <Show when={canManage()}>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">
                      Active
                    </th>
                  </Show>
                  <Show when={canManage()}>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">
                      Actions
                    </th>
                  </Show>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <Show
                  when={!newsQuery.isPending && !newsQuery.isError}
                  fallback={
                    <tr>
                      <td
                        colspan={canManage() ? 7 : 5}
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        <Show when={newsQuery.isPending}>Loading...</Show>
                        <Show when={newsQuery.isError}>Error loading news</Show>
                      </td>
                    </tr>
                  }
                >
                  <For each={newsQuery.data?.value || []}>
                    {(article) => (
                      <NewsItem
                        article={article}
                        canManage={canManage()}
                        onUpdate={handleUpdateClick}
                        onDelete={handleDeleteClick}
                      />
                    )}
                  </For>
                </Show>
              </tbody>
            </table>
        </div>
      </div>

      <CreateNewsDialog
        open={createDialogOpen()}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => newsQuery.refetch()}
      />

      <UpdateNewsDialog
        open={updateDialogOpen()}
        article={selectedArticle()}
        onOpenChange={setUpdateDialogOpen}
        onSuccess={() => {
          newsQuery.refetch();
        }}
      />
      
      <Dialog open={deleteDialogOpen()} onOpenChange={setDeleteDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the article "{selectedArticle()?.NewsTitle}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Show when={deleteNewsMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {deleteNewsMutation.error?.message || "Failed to delete article"}
            </div>
          </Show>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteNewsMutation.isPending}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteNewsMutation.isPending}
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={deleteNewsMutation.isPending}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </Show>
              {deleteNewsMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
