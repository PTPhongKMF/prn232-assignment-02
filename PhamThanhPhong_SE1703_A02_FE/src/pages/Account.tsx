import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { createAccountsQuery } from "../services/users/user-queries.ts";
import {
  createDeleteAccountMutation,
  createUpdateAccountMutation,
} from "../services/users/user-mutations.ts";
import type { Account } from "../schemas/user.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/libs/shadcn-solid/Dialog.tsx";
import { Code, Plus, Search } from "lucide-solid";
import AccountItem from "../components/accounts/AccountItem.tsx";
import CreateAccountDialog from "../components/accounts/CreateAccountDialog.tsx";
import { debounce } from "../utils/debounce.ts";
import { on } from "solid-js";

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchStr, setSearchStr] = createSignal("");
  const [debouncedSearchStr, setDebouncedSearchStr] = createSignal("");
  const [isODataMode, setIsODataMode] = createSignal(false);
  const [selectedAccount, setSelectedAccount] = createSignal<Account | null>(
    null,
  );
  const [updateDialogOpen, setUpdateDialogOpen] = createSignal(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [createDialogOpen, setCreateDialogOpen] = createSignal(false);

  const [updateForm, setUpdateForm] = createSignal({
    AccountName: "",
    AccountEmail: "",
    AccountPassword: "",
    AccountRole: 1,
  });

  const debouncedSearch = debounce((value: string) => {
    setDebouncedSearchStr(value);
  }, 500);

  const accountsQuery = createAccountsQuery(debouncedSearchStr, isODataMode);
  const updateAccountMutation = createUpdateAccountMutation();
  const deleteAccountMutation = createDeleteAccountMutation();

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

  const handleUpdateClick = (account: Account) => {
    setSelectedAccount(account);
    setUpdateForm({
      AccountName: account.AccountName,
      AccountEmail: account.AccountEmail,
      AccountPassword: account.AccountPassword,
      AccountRole: account.AccountRole,
    });
    setUpdateDialogOpen(true);
    console.log("Update clicked for:", account);
  };

  const handleDeleteClick = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
    console.log("Delete clicked for:", account);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    accountsQuery.refetch();
  };

  const handleUpdateSubmit = (e: Event) => {
    e.preventDefault();

    const accountId = selectedAccount()?.AccountId;
    if (!accountId) return;

    const updateData = {
      accountName: updateForm().AccountName,
      accountEmail: updateForm().AccountEmail,
      accountPassword: updateForm().AccountPassword,
      accountRole: updateForm().AccountRole,
    };

    updateAccountMutation.mutate({ id: accountId, data: updateData }, {
      onSuccess: () => {
        console.log("Account updated successfully");
        setUpdateDialogOpen(false);
        accountsQuery.refetch();
      },
      onError: (err: Error) => {
        console.error("Update account error:", err);
      },
    });
  };

  const handleDeleteConfirm = () => {
    const accountId = selectedAccount()?.AccountId;
    if (!accountId) return;

    deleteAccountMutation.mutate(accountId, {
      onSuccess: () => {
        console.log("Account deleted successfully");
        setDeleteDialogOpen(false);
        accountsQuery.refetch();
      },
      onError: (err: Error) => {
        console.error("Delete account error:", err);
      },
    });
  };

  return (
    <div class="py-6 px-16 mt-12">
      <div class="mb-6 w-full">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Account Management
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
                : "Search by account name"}
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
                  ? "e.g., $filter=AccountRole eq 1&$orderby=AccountName"
                  : "Search accounts..."}
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
              Create Account
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div
            class="overflow-auto max-h-[600px] scrollbar-hide"
            style="scrollbar-width: none; -ms-overflow-style: none;"
          >
            <style>
              {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
            </style>
            <table class="w-full table-fixed">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                    ID
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-48">
                    Name
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-64">
                    Email
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-48">
                    Password
                  </th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-32">
                    Role
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
                  when={!accountsQuery.isPending && !accountsQuery.isError}
                  fallback={
                    <tr>
                      <td
                        colspan="7"
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        <Show when={accountsQuery.isPending}>Loading...</Show>
                        <Show when={accountsQuery.isError}>
                          Error loading accounts
                        </Show>
                      </td>
                    </tr>
                  }
                >
                  <For each={accountsQuery.data?.value || []}>
                    {(account) => (
                      <AccountItem
                        account={account}
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
      </div>

      <Dialog open={updateDialogOpen()} onOpenChange={setUpdateDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Account</DialogTitle>
            <DialogDescription>
              Update the account information below.
            </DialogDescription>
          </DialogHeader>

          <Show when={updateAccountMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {updateAccountMutation.error?.message ||
                "Failed to update account"}
            </div>
          </Show>

          <form onSubmit={handleUpdateSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={updateForm().AccountName}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    AccountName: e.currentTarget.value,
                  }))}
                disabled={updateAccountMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={updateForm().AccountEmail}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    AccountEmail: e.currentTarget.value,
                  }))}
                disabled={updateAccountMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={updateForm().AccountPassword}
                onInput={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    AccountPassword: e.currentTarget.value,
                  }))}
                disabled={updateAccountMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={updateForm().AccountRole}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    AccountRole: parseInt(e.currentTarget.value),
                  }))}
                disabled={updateAccountMutation.isPending}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value={1}>Staff</option>
                <option value={2}>Lecturer</option>
              </select>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setUpdateDialogOpen(false)}
                disabled={updateAccountMutation.isPending}
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateAccountMutation.isPending}
                class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Show when={updateAccountMutation.isPending}>
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                  </div>
                </Show>
                {updateAccountMutation.isPending ? "Updating..." : "Update"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen()} onOpenChange={setDeleteDialogOpen}>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account "{selectedAccount()
                ?.AccountName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Show when={deleteAccountMutation.error}>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {deleteAccountMutation.error?.message ||
                "Failed to delete account"}
            </div>
          </Show>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteAccountMutation.isPending}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteAccountMutation.isPending}
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={deleteAccountMutation.isPending}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                </div>
              </Show>
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateAccountDialog
        open={createDialogOpen()}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
