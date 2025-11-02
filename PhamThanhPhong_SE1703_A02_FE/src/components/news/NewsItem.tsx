import { For, Show, type Component } from "solid-js";
import type { NewsArticle } from "../../schemas/news.ts";
import { SquarePen, Trash2 } from "lucide-solid";

export interface NewsItemProps {
  article: NewsArticle;
  canManage: boolean;
  onUpdate: (article: NewsArticle) => void;
  onDelete: (article: NewsArticle) => void;
}

const NewsItem: Component<NewsItemProps> = (props) => {
  return (
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3 text-sm text-gray-900 w-16">
        {props.article.NewsArticleId}
      </td>
      <td class="px-4 py-3 text-sm text-gray-900 w-80">
        <span class="block truncate">{props.article.NewsTitle}</span>
        <Show when={props.article.Headline}>
          <span class="block text-xs text-gray-500 truncate">
            {props.article.Headline}
          </span>
        </Show>
      </td>
      <td class="px-4 py-3 text-sm text-gray-700 w-[360px]">
        <span class="block truncate">{props.article.NewsContent}</span>
      </td>
      <td class="px-4 py-3 text-sm w-40">
        <div
          class="max-h-10 overflow-auto scrollbar-hide"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <style>
            {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
          </style>
          <div class="flex flex-wrap gap-1">
            <For each={props.article.Tags}>
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
        <span class="block truncate">{props.article.CategoryName}</span>
      </td>
      <Show when={props.canManage}>
        <td class="px-4 py-3 w-24 text-center">
          <span
            class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              props.article.NewsStatus ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
            }`}
          >
            {props.article.NewsStatus ? "Yes" : "No"}
          </span>
        </td>
      </Show>
      <Show when={props.canManage}>
        <td class="px-4 py-3 w-24">
          <div class="flex items-center justify-center gap-2">
            <button
              onClick={() => props.onUpdate(props.article)}
              class="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              title="Edit article"
            >
              <SquarePen size={16} />
            </button>
            <button
              onClick={() => props.onDelete(props.article)}
              class="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              title="Delete article"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </Show>
    </tr>
  );
};

export default NewsItem;



