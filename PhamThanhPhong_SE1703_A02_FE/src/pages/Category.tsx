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
import type { Category, UpdateCategoryRequest } from "../schemas/category.ts";
import { createCategoriesQuery } from "../services/categories/category-queries.ts";
import {
  createDeleteCategoryMutation,
  createUpdateCategoryMutation,
} from "../services/categories/category-mutations.ts";
import { debounce } from "../utils/debounce.ts";
import CategoryItem from "../components/categories/CategoryItem.tsx";
import CreateCategoryDialog from "../components/categories/CreateCategoryDialog.tsx";

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchStr, setSearchStr] = createSignal("");
  const [debouncedSearchStr, setDebouncedSearchStr] = createSignal("");
  const [isODataMode, setIsODataMode] = createSignal(false);

  const [selectedCategory, setSelectedCategory] = createSignal<Category | null>(
    null,
  );

  const [updateDialogOpen, setUpdateDialogOpen] = createSignal(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [createDialogOpen, setCreateDialogOpen] = createSignal(false);

  const [updateForm, setUpdateForm] = createSignal({
    CategoryName: "",
    CategoryDesciption: "",
    IsActive: true,
  });

  const debouncedSearch = debounce((value: string) => {
    setDebouncedSearchStr(value);
  }, 500);

  const categoriesQuery = createCategoriesQuery(
    debouncedSearchStr,
    isODataMode,
  );
  const updateCategoryMutation = createUpdateCategoryMutation();
  const deleteCategoryMutation = createDeleteCategoryMutation();

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
      () =>
        [debouncedSearchStr(), isODataMode()] as [string | undefined, boolean],
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

  const handleUpdateClick = (category: Category) => {
    setSelectedCategory(category);
    setUpdateForm({
      CategoryName: category.CategoryName,
      CategoryDesciption: category.CategoryDesciption,
      IsActive: category.IsActive,
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = (e: Event) => {
    e.preventDefault();
    const id = selectedCategory()?.CategoryId;
    if (!id) return;
    const updateData: UpdateCategoryRequest = {
      categoryName: updateForm().CategoryName,
      categoryDesciption: updateForm().CategoryDesciption,
      isActive: updateForm().IsActive,
    };
    updateCategoryMutation.mutate(
      { id, data: updateData },
      {
        onSuccess: () => {
          setUpdateDialogOpen(false);
          categoriesQuery.refetch();
        },
      },
    );
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const id = selectedCategory()?.CategoryId;
    if (!id) return;
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        categoriesQuery.refetch();
      },
    });
  };

  return (
    <div class="py-6 px-16 mt-12">
      <div class="mb-6 w-full">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Category Management
        </h1>

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
                : "Search by category name"}
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
                placeholder={isODataMode()
                  ? "e.g., $filter=IsActive eq true&$orderby=CategoryName"
                  : "Search categories..."}
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
              Create Category
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
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-[480px]">
                    Description
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-32">
                    Active
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-32">
                    Deleteable
                  </th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <Show
                  when={!categoriesQuery.isPending && !categoriesQuery.isError}
                  fallback={
                    <tr>
                      <td
                        colspan="6"
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        <Show when={categoriesQuery.isPending}>Loading...</Show>
                        <Show when={categoriesQuery.isError}>
                          Error loading categories
                        </Show>
                      </td>
                    </tr>
                  }
                >
                  <For each={categoriesQuery.data?.value || []}>
                    {(category) => (
                      <CategoryItem
                        category={category}
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

      <CreateCategoryDialog
        open={createDialogOpen()}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => categoriesQuery.refetch()}
      />
      
      <Dialog open={updateDialogOpen()} onOpenChange={setUpdateDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>
              Update the category information below.
            </DialogDescription>
          </DialogHeader>

          <Show when={updateCategoryMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {updateCategoryMutation.error?.message ||
                "Failed to update category"}
            </div>
          </Show>

          <form onSubmit={handleUpdateSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={updateForm().CategoryName}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    CategoryName: e.currentTarget.value,
                  }))}
                disabled={updateCategoryMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={updateForm().CategoryDesciption}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    CategoryDesciption: e.currentTarget.value,
                  }))}
                disabled={updateCategoryMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Active
              </label>
              <select
                value={updateForm().IsActive ? "true" : "false"}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    IsActive: e.currentTarget.value === "true",
                  }))}
                disabled={updateCategoryMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setUpdateDialogOpen(false)}
                disabled={updateCategoryMutation.isPending}
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateCategoryMutation.isPending}
                class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Show when={updateCategoryMutation.isPending}>
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                  </div>
                </Show>
                {updateCategoryMutation.isPending ? "Updating..." : "Update"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDialogOpen()} onOpenChange={setDeleteDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory()
                ?.CategoryName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Show when={deleteCategoryMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {deleteCategoryMutation.error?.message ||
                "Failed to delete category"}
            </div>
          </Show>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteCategoryMutation.isPending}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteCategoryMutation.isPending}
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={deleteCategoryMutation.isPending}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                </div>
              </Show>
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
