import { createEffect, createSignal, Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../libs/shadcn-solid/Dialog.tsx";
import { createUpdateInfoMutation } from "../../services/me/me-mutations.ts";

interface UpdateInfoDialogProps {
  open: boolean;
  initialName: string;
  initialEmail: string;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UpdateInfoDialog(props: UpdateInfoDialogProps) {
  const [name, setName] = createSignal(props.initialName);
  const [email, setEmail] = createSignal(props.initialEmail);

  const mutation = createUpdateInfoMutation();

  createEffect(() => {
    if (props.open) {
      setName(props.initialName);
      setEmail(props.initialEmail);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    mutation.mutate(
      { accountName: name(), accountEmail: email() },
      {
        onSuccess: () => {
          props.onOpenChange(false);
          props.onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Info</DialogTitle>
          <DialogDescription>Change your name or email.</DialogDescription>
        </DialogHeader>

        <Show when={mutation.error}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {mutation.error?.message || "Failed to update info"}
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              disabled={mutation.isPending}
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
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              disabled={mutation.isPending}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => props.onOpenChange(false)}
              disabled={mutation.isPending}
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Show when={mutation.isPending}>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                </div>
              </Show>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
