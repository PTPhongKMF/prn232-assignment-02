import { Show } from "solid-js";
import type { Category } from "../../schemas/category.ts";
import { SquarePen, Trash2 } from "lucide-solid";

interface CategoryItemProps {
  category: Category;
  onUpdate: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryItem(props: CategoryItemProps) {
  return (
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3 text-sm text-gray-900 w-16">
        {props.category.CategoryId}
      </td>
      <td class="px-4 py-3 text-sm text-gray-900 w-64">
        <span class="block truncate">{props.category.CategoryName}</span>
      </td>
      <td class="px-4 py-3 text-sm text-gray-700 w-[480px]">
        <span class="block truncate">{props.category.CategoryDesciption}</span>
      </td>
      <td class="px-4 py-3 text-sm w-32">
        <span
          class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            props.category.IsActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {props.category.IsActive ? "Yes" : "No"}
        </span>
      </td>
      <td class="px-4 py-3 text-sm w-32">
        <span
          class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            props.category.Deleteable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {props.category.Deleteable ? "Yes" : "No"}
        </span>
      </td>
      <td class="px-4 py-3 w-32">
        <div class="flex items-center justify-center gap-2">
          <button
            onClick={() => props.onUpdate(props.category)}
            class="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Edit category"
          >
            <SquarePen size={16} />
          </button>
          <Show when={props.category.Deleteable}>
            <button
              onClick={() => props.onDelete(props.category)}
              class="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              title="Delete category"
            >
              <Trash2 size={16} />
            </button>
          </Show>
        </div>
      </td>
    </tr>
  );
}


