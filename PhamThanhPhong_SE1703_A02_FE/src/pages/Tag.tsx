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
import type { Tag, UpdateTagRequest } from "../schemas/tag.ts";
import { createTagsQueryWithSearch } from "../services/tags/tag-queries.ts";
import {
  createDeleteTagMutation,
  createUpdateTagMutation,
} from "../services/tags/tag-mutations.ts";
import { debounce } from "../utils/debounce.ts";
import TagItem from "../components/tags/TagItem.tsx";
import CreateTagDialog from "../components/tags/CreateTagDialog.tsx";

export default function Tag() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchStr, setSearchStr] = createSignal("");
  const [debouncedSearchStr, setDebouncedSearchStr] = createSignal("");
  const [isODataMode, setIsODataMode] = createSignal(false);

  const [selectedTag, setSelectedTag] = createSignal<Tag | null>(null);

  const [updateDialogOpen, setUpdateDialogOpen] = createSignal(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [createDialogOpen, setCreateDialogOpen] = createSignal(false);

  const [updateForm, setUpdateForm] = createSignal({
    TagName: "",
    Note: "",
  });

  const debouncedSearch = debounce((value: string) => {
    setDebouncedSearchStr(value);
  }, 500);

  const tagsQuery = createTagsQueryWithSearch(
    debouncedSearchStr,
    isODataMode,
  );
  const updateTagMutation = createUpdateTagMutation();
  const deleteTagMutation = createDeleteTagMutation();

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
    setCreateDialogOpen(true);
  };

  const handleUpdateClick = (tag: Tag) => {
    setSelectedTag(tag);
    setUpdateForm({
      TagName: tag.TagName,
      Note: tag.Note || "",
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = (e: Event) => {
    e.preventDefault();
    const id = selectedTag()?.TagId;
    if (!id) return;
    const updateData: UpdateTagRequest = {
      tagName: updateForm().TagName,
      note: updateForm().Note,
    };
    updateTagMutation.mutate(
      { id, data: updateData },
      {
        onSuccess: () => {
          setUpdateDialogOpen(false);
          tagsQuery.refetch();
        },
      },
    );
  };

  const handleDeleteClick = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const id = selectedTag()?.TagId;
    if (!id) return;
    deleteTagMutation.mutate(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        tagsQuery.refetch();
      },
    });
  };

  return (
    <div class="py-6 px-16 mt-12">
      <div class="mb-6 w-full">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Tag Management</h1>

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
              {isODataMode() ? "Enter OData query syntax" : "Search by tag name"}
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
                    ? "e.g., $filter=contains(TagName,'Tech')&$orderby=TagName"
                    : "Search tags..."
                }
                value={searchStr()}
                onInput={(e) => handleSearchInput(e.currentTarget.value)}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition cursor-text"
              />
            </div>

            <button
              type="button"
              onClick={handleCreateClick}
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus size={20} />
              Create Tag
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full table-fixed">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                  ID
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-64">
                  Name
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Note
                </th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <Show
                when={!tagsQuery.isPending && !tagsQuery.isError}
                fallback={
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                      <Show when={tagsQuery.isPending}>Loading...</Show>
                      <Show when={tagsQuery.isError}>Error loading tags</Show>
                    </td>
                  </tr>
                }
              >
                <For each={tagsQuery.data?.value || []}>
                  {(tag) => (
                    <TagItem tag={tag} onUpdate={handleUpdateClick} onDelete={handleDeleteClick} />
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
      </div>

      <CreateTagDialog
        open={createDialogOpen()}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => tagsQuery.refetch()}
      />
      
      <Dialog open={updateDialogOpen()} onOpenChange={setUpdateDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Tag</DialogTitle>
            <DialogDescription>Update the tag information below.</DialogDescription>
          </DialogHeader>

          <Show when={updateTagMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {updateTagMutation.error?.message || "Failed to update tag"}
            </div>
          </Show>

          <form onSubmit={handleUpdateSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={updateForm().TagName}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    TagName: e.currentTarget.value,
                  }))}
                disabled={updateTagMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                value={updateForm().Note}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    Note: e.currentTarget.value,
                  }))}
                disabled={updateTagMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setUpdateDialogOpen(false)}
                disabled={updateTagMutation.isPending}
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateTagMutation.isPending}
                class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Show when={updateTagMutation.isPending}>
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </Show>
                {updateTagMutation.isPending ? "Updating..." : "Update"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      
      <Dialog open={deleteDialogOpen()} onOpenChange={setDeleteDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{selectedTag()?.TagName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Show when={deleteTagMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {deleteTagMutation.error?.message || "Failed to delete tag"}
            </div>
          </Show>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteTagMutation.isPending}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteTagMutation.isPending}
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={deleteTagMutation.isPending}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </Show>
              {deleteTagMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
