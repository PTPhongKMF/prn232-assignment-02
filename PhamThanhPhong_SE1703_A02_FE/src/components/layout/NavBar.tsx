import { A, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { setUser, user } from "../../stores/user-store.ts";
import { getRoleName } from "../../utils/role.ts";
import { For } from "solid-js";
import { LogOut } from "lucide-solid";

export interface NavRoute {
  name: string;
  url: string;
  roles: number[];
}

const navRoutes: NavRoute[] = [
  { name: "News", url: "/", roles: [0, 1, 2, 3] },
  { name: "Account Management", url: "/accounts", roles: [3] },
  { name: "News Statistic", url: "/statistic", roles: [3] },
  { name: "Category Management", url: "/categories", roles: [1] },
  { name: "Tag Management", url: "/tags", roles: [1] },
];

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav class="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div class="grid grid-cols-[20rem_1fr_20rem] items-center h-12 px-16 py-2">
        <A
          href="/"
          class="hover:text-amber-500 font-bold text-xl justify-self-start transition-colors duration-100"
        >
          FU News Management System
        </A>

        <div class="flex justify-center items-center gap-4">
          <For
            each={navRoutes.filter((r) =>
              r.roles.includes(user()?.accountRole ?? 0)
            )}
          >
            {(r, i) => (
              <>
                <A
                  href={r.url}
                  class="hover:text-blue-500 text-sm transition-colors duration-100"
                >
                  {r.name}
                </A>

                <Show
                  when={i() <
                    navRoutes.filter((r) =>
                        r.roles.includes(user()?.accountRole ?? 0)
                      ).length - 1}
                >
                  <div class="w-[0.1rem] h-5 bg-gray-400 size-5 text-xl" />
                </Show>
              </>
            )}
          </For>
        </div>

        <div class="flex justify-between items-center gap-6 justify-self-end">
          <Show
            when={user()}
            fallback={
              <A
                href="login"
                class="hover:text-green-500 font-semibold py-1 px-6 rounded-lg transition-colors duration-100"
              >
                Log in
              </A>
            }
          >
            <div class="flex justify-center items-center">
              <A
                href="profile"
                class="hover:bg-gray-200 flex justify-center items-center gap-2 py-1 px-2
            transition-colors duration-100 rounded-xl h-8 align-middle"
              >
                <p class="font-semibold [text-box:trim-both_cap_alphabetic] whitespace-nowrap">
                  Hello,{" "}
                  <span class="inline-block max-w-32 whitespace-nowrap overflow-hidden text-ellipsis align-bottom">
                    {user()?.accountName || "user"}
                  </span>
                </p>
                <p class="text-sm [text-box:trim-both_cap_alphabetic]">
                  (role: {getRoleName(user()?.accountRole)})
                </p>
              </A>

              <button
                onclick={() => {
                  setUser(undefined);
                  navigate("/");
                }}
                type="button"
                class="px-1 rounded-xl hover:text-red-500 cursor-pointer align-middle
                transition-colors duration-100"
              >
                <LogOut class="size-5" />
              </button>
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}
