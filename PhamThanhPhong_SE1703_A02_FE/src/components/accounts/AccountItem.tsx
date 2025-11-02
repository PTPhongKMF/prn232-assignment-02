import { createSignal, Show } from "solid-js";
import type { Account } from "../../schemas/user.ts";
import { Eye, EyeOff, SquarePen, Trash2 } from "lucide-solid";
import { getRoleName } from "../../utils/role.ts";

interface AccountItemProps {
  account: Account;
  onUpdate: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export default function AccountItem(props: AccountItemProps) {
  const [showPassword, setShowPassword] = createSignal(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3 text-sm text-gray-900 w-16">
        {props.account.AccountId}
      </td>
      <td class="px-4 py-3 text-sm text-gray-900 w-48">
        <span class="block truncate">{props.account.AccountName}</span>
      </td>
      <td class="px-4 py-3 text-sm text-gray-900 w-64">
        <span class="block truncate">{props.account.AccountEmail}</span>
      </td>
      <td class="px-4 py-3 text-sm w-48">
        <div class="flex items-center gap-2">
          <div class="flex-1 min-w-0">
            <span class="block truncate">
              {showPassword() ? props.account.AccountPassword : "••••••••"}
            </span>
          </div>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Show
              when={showPassword()}
              fallback={<Eye size={16} />}
            >
              <EyeOff size={16} />
            </Show>
          </button>
        </div>
      </td>
      <td class="px-4 py-3 text-sm w-32">
        <span
          class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            props.account.AccountRole === 3
              ? "bg-red-100 text-red-800"
              : props.account.AccountRole === 2
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {getRoleName(props.account.AccountRole)}
        </span>
      </td>
      <td class="px-4 py-3 text-sm w-32">
        <span
          class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            props.account.Deleteable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {props.account.Deleteable ? "Yes" : "No"}
        </span>
      </td>
      <td class="px-4 py-3 w-32">
        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => props.onUpdate(props.account)}
            class="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Edit account"
          >
            <SquarePen size={16} />
          </button>
          <Show when={props.account.Deleteable}>
            <button
              type="button"
              onClick={() => props.onDelete(props.account)}
              class="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              title="Delete account"
            >
              <Trash2 size={16} />
            </button>
          </Show>
        </div>
      </td>
    </tr>
  );
}
