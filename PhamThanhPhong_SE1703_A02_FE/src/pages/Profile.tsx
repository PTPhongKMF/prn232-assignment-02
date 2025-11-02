import { createSignal, For, Show } from "solid-js";
import { Search } from "lucide-solid";
import { createMeQuery } from "../services/me/me-queries.ts";
import UpdateInfoDialog from "../components/profile/UpdateInfoDialog.tsx";
import ChangePasswordDialog from "../components/profile/ChangePasswordDialog.tsx";
import { createNewsByCreatorQuery } from "../services/news/news-queries.ts";
import { getRoleName } from "../utils/role.ts";
import { setUser } from "../stores/user-store.ts";
import { useNavigate } from "@solidjs/router";

export default function Profile() {
  const navigate = useNavigate();
  const meQuery = createMeQuery();

  const [updateDialogOpen, setUpdateDialogOpen] = createSignal(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = createSignal(false);

  const [searchStr, setSearchStr] = createSignal("");
  const [debouncedSearchStr, setDebouncedSearchStr] = createSignal("");

  let debounceTimer: number | undefined;
  const debouncedSearch = (value: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearchStr(value), 500);
  };

  const newsByMeQuery = createNewsByCreatorQuery(
    () => meQuery.data?.data.accountId,
    debouncedSearchStr,
  );

  const handleSearchInput = (value: string) => {
    setSearchStr(value);
    debouncedSearch(value);
  };

  return (
    <div class="py-6 px-16 mt-12 space-y-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">My Profile</h1>
        <Show when={!meQuery.isPending && !meQuery.isError}>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-sm text-gray-500">Name</div>
              <div class="text-gray-900 font-medium">
                {meQuery.data!.data.accountName}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Email</div>
              <div class="text-gray-900 font-medium">
                {meQuery.data!.data.accountEmail}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Role</div>
              <div class="text-gray-900 font-medium">
                {meQuery.data!.data.accountRole}{" "}
                ({getRoleName(meQuery.data!.data.accountRole)})
              </div>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <Show when={meQuery.data!.data.accountRole !== 3}>
              <button
                type="button"
                onClick={() => setUpdateDialogOpen(true)}
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Update Info
              </button>

              <button
                type="button"
                onClick={() => setPasswordDialogOpen(true)}
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Change Password
              </button>
            </Show>
          </div>
        </Show>

        <Show when={meQuery.isPending || meQuery.isError}>
          <div class="text-gray-500">
            <Show when={meQuery.isPending}>Loading profile...</Show>
            <Show when={meQuery.isError}>Failed to load profile</Show>
          </div>
        </Show>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">My News</h2>
          <div class="relative w-80">
            <Search
              size={18}
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search my news..."
              value={searchStr()}
              onInput={(e) => handleSearchInput(e.currentTarget.value)}
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            />
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                  ID
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-80">
                  Title
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
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">
                  Active
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <Show
                when={!newsByMeQuery.isPending && !newsByMeQuery.isError}
                fallback={
                  <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                      <Show when={newsByMeQuery.isPending}>Loading...</Show>
                      <Show when={newsByMeQuery.isError}>
                        Error loading news
                      </Show>
                    </td>
                  </tr>
                }
              >
                <For each={newsByMeQuery.data?.value || []}>
                  {(article) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 text-sm text-gray-900 w-16">
                        {article.NewsArticleId}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-900 w-80">
                        <span class="block truncate">{article.NewsTitle}</span>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-700 w-[360px]">
                        <span class="block truncate">
                          {article.NewsContent}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm w-40">
                        <div
                          class="max-h-10 overflow-auto scrollbar-hide"
                          style="scrollbar-width: none; -ms-overflow-style: none;"
                        >
                          <style>
                            {`.scrollbar-hide::-webkit-scrollbar { display: none; }`}
                          </style>
                          <div class="flex flex-wrap gap-1">
                            <For each={article.Tags || []}>
                              {(tag) => (
                                <span class="inline-flex px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  {tag.TagName}
                                </span>
                              )}
                            </For>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-sm w-40">
                        <span class="block truncate">
                          {article.CategoryName}
                        </span>
                      </td>
                      <td class="px-4 py-3 w-24 text-center">
                        <span
                          class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            article.NewsStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {article.NewsStatus ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
      </div>

      <UpdateInfoDialog
        open={updateDialogOpen()}
        initialName={meQuery.data?.data.accountName || ""}
        initialEmail={meQuery.data?.data.accountEmail || ""}
        onOpenChange={setUpdateDialogOpen}
        onSuccess={() => meQuery.refetch()}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen()}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={() => {
          setUser(undefined);
          navigate("/");
        }}
      />
    </div>
  );
}
