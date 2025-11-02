import type { Tag } from "../../schemas/tag.ts";
import { SquarePen, Trash2 } from "lucide-solid";

interface TagItemProps {
  tag: Tag;
  onUpdate: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export default function TagItem(props: TagItemProps) {
  return (
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3 text-sm text-gray-900 w-16">{props.tag.TagId}</td>
      <td class="px-4 py-3 text-sm text-gray-900 w-64">
        <span class="block truncate">{props.tag.TagName}</span>
      </td>
      <td class="px-4 py-3 text-sm text-gray-700">
        <span class="block truncate">{props.tag.Note}</span>
      </td>
      <td class="px-4 py-3 w-32">
        <div class="flex items-center justify-center gap-2">
          <button
            onClick={() => props.onUpdate(props.tag)}
            class="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Edit tag"
          >
            <SquarePen size={16} />
          </button>
          <button
            onClick={() => props.onDelete(props.tag)}
            class="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
            title="Delete tag"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}


