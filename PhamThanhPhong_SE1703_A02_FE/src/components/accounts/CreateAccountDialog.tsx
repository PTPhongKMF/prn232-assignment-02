import { createSignal, Show } from "solid-js";
import { createCreateAccountMutation } from "../../services/users/user-mutations.ts";
import type { CreateAccountRequest } from "../../schemas/user.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../libs/shadcn-solid/Dialog.tsx";
import { getRoleName } from "../../utils/role.ts";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateAccountDialog(props: CreateAccountDialogProps) {
  const [formData, setFormData] = createSignal<CreateAccountRequest>({
    accountName: "",
    accountEmail: "",
    accountPassword: "",
    accountRole: 1,
  });

  const createAccountMutation = createCreateAccountMutation();

  const resetForm = () => {
    setFormData({
      accountName: "",
      accountEmail: "",
      accountPassword: "",
      accountRole: 1,
    });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    createAccountMutation.mutate(formData(), {
      onSuccess: () => {
        console.log("Account created successfully");
        resetForm();
        props.onOpenChange(false);
        props.onSuccess();
      },
      onError: (err) => {
        console.error("Create account error:", err);
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !createAccountMutation.isPending) {
      resetForm();
    }
    props.onOpenChange(open);
  };

  const isLoading = () => createAccountMutation.isPending;

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new account.
          </DialogDescription>
        </DialogHeader>

        <Show when={createAccountMutation.error}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {createAccountMutation.error?.message || "Failed to create account"}
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData().accountName}
              onInput={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountName: e.currentTarget.value,
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter account name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData().accountEmail}
              onInput={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountEmail: e.currentTarget.value,
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData().accountPassword}
              onInput={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountPassword: e.currentTarget.value,
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData().accountRole}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountRole: parseInt(e.currentTarget.value),
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value={1}>{getRoleName(1)}</option>
              <option value={2}>{getRoleName(2)}</option>
            </select>
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
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                </div>
              </Show>
              {isLoading() ? "Creating..." : "Create Account"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
