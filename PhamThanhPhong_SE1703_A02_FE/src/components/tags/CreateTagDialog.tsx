import { createSignal, Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../libs/shadcn-solid/Dialog.tsx";
import type { CreateTagRequest } from "../../schemas/tag.ts";
import { createCreateTagMutation } from "../../services/tags/tag-mutations.ts";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateTagDialog(props: CreateTagDialogProps) {
  const [formData, setFormData] = createSignal<CreateTagRequest>({
    tagName: "",
    note: "",
  });

  const mutation = createCreateTagMutation();

  const resetForm = () => {
    setFormData({ tagName: "", note: "" });
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
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new tag.
          </DialogDescription>
        </DialogHeader>

        <Show when={mutation.error}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {mutation.error?.message || "Failed to create tag"}
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData().tagName}
              onInput={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tagName: e.currentTarget.value,
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter tag name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              value={formData().note}
              onInput={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  note: e.currentTarget.value,
                }))}
              disabled={isLoading()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={3}
            />
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
              {isLoading() ? "Creating..." : "Create Tag"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


