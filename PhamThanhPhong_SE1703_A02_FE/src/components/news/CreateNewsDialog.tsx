import { createSignal, Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../libs/shadcn-solid/Dialog.tsx";
import type { CreateNewsRequest } from "../../schemas/news.ts";
import { createCreateNewsMutation } from "../../services/news/news-mutations.ts";
import { createCategoriesQuery } from "../../services/categories/category-queries.ts";
import { createTagsQuery } from "../../services/tags/tag-queries.ts";

interface CreateNewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateNewsDialog(props: CreateNewsDialogProps) {
  const [formData, setFormData] = createSignal<CreateNewsRequest>({
    newsTitle: "",
    headline: "",
    newsContent: "",
    newsSource: "",
    categoryId: undefined,
    tagIds: [],
    newsStatus: true,
  });

  const mutation = createCreateNewsMutation();
  const categoriesQuery = createCategoriesQuery(() => "", () => false);
  const tagsQuery = createTagsQuery();

  const resetForm = () => {
    setFormData({
      newsTitle: "",
      headline: "",
      newsContent: "",
      newsSource: "",
      categoryId: undefined,
      tagIds: [],
      newsStatus: true,
    });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    mutation.mutate(formData(), {
      onSuccess: () => {
        resetForm();
        props.onOpenChange(false);
        props.onSuccess();
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !mutation.isPending) resetForm();
    props.onOpenChange(open);
  };

  const isLoading = () => mutation.isPending;

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <DialogContent class="sm:max-w-md h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create News Article</DialogTitle>
          <DialogDescription>
            Fill out details to create a news article.
          </DialogDescription>
        </DialogHeader>

        <Show when={mutation.error}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {mutation.error?.message || "Failed to create news"}
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData().newsTitle}
              onInput={(e) =>
                setFormData((prev) => ({ ...prev, newsTitle: e.currentTarget.value }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={formData().headline || ""}
              onInput={(e) =>
                setFormData((prev) => ({ ...prev, headline: e.currentTarget.value }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData().categoryId ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: e.currentTarget.value ? Number(e.currentTarget.value) : undefined,
                }))
              }
              disabled={isLoading() || categoriesQuery.isPending}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              required
            >
              <option value="" disabled>
                {categoriesQuery.isPending ? "Loading categories..." : "Select a category"}
              </option>
              <For each={categoriesQuery.data?.value || []}>
                {(c) => (
                  <option value={c.CategoryId}>{c.CategoryName}</option>
                )}
              </For>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div
              class="max-h-40 overflow-auto scrollbar-hide border border-gray-200 rounded-lg p-2"
              style="scrollbar-width: none; -ms-overflow-style: none;"
            >
              <style>
                {`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
              `}
              </style>
              <Show when={!tagsQuery.isPending} fallback={<div class="text-sm text-gray-500">Loading tags...</div>}>
                <div class="flex flex-wrap gap-3">
                  <For each={tagsQuery.data?.value || []}>
                    {(tag) => {
                      const checked = (formData().tagIds || []).includes(tag.TagId);
                      return (
                        <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const isChecked = e.currentTarget.checked;
                              setFormData((prev) => {
                                const current = new Set(prev.tagIds || []);
                                if (isChecked) current.add(tag.TagId);
                                else current.delete(tag.TagId);
                                return { ...prev, tagIds: Array.from(current) };
                              });
                            }}
                            class="cursor-pointer"
                            disabled={isLoading()}
                          />
                          <span>{tag.TagName}</span>
                        </label>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData().newsContent || ""}
              onInput={(e) =>
                setFormData((prev) => ({ ...prev, newsContent: e.currentTarget.value }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={4}
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                value={formData().newsSource || ""}
                onInput={(e) =>
                  setFormData((prev) => ({ ...prev, newsSource: e.currentTarget.value }))}
                disabled={isLoading()}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Active
              </label>
              <select
                value={formData().newsStatus ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newsStatus: e.currentTarget.value === "true",
                  }))
                }
                disabled={isLoading()}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading()}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading()}
              class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={isLoading()}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </Show>
              {isLoading() ? "Saving..." : "Create Article"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



