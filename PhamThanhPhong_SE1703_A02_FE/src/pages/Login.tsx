import { createSignal } from "solid-js";
import { createLoginMutation } from "../services/users/user-mutations.ts";
import { useNavigate } from "@solidjs/router";
import { setUser } from "../stores/user-store.ts";
import { Show } from "solid-js";

export default function Login() {
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");

  const navigate = useNavigate();

  const loginMutation = createLoginMutation();

  function handleLogin(e: Event) {
    e.preventDefault();
    loginMutation.mutate({ email: email(), password: password() }, {
      onSuccess: (data) => {
        setUser(data.data);
        navigate("/");
      },
    });
  }

  return (
    <div class="grid place-items-center bg-linear-to-br from-rose-100 via-sky-100 to-violet-100 pt-16">
      <div class="w-full max-w-md">
        <div class="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5">
          <div class="p-8">
            <h1 class="text-2xl font-semibold text-neutral-800 mb-19 text-center">
              Log in
            </h1>

            <form
              onSubmit={handleLogin}
              class="flex flex-col justify-center gap-4"
            >
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                  placeholder="phong@fpt.com"
                />
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                  placeholder="••••••••"
                />
              </div>

              <p class="font-semibold text-sm text-red-500 overflow-y-auto h-13">
                <Show when={loginMutation.isError}>
                  {loginMutation.error?.message}
                </Show>
              </p>

              <button
                type="submit"
                class="mt-2 cursor-pointer w-full inline-flex justify-center items-center rounded-lg bg-sky-500 text-white font-medium px-4 py-2.5 hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 transition"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
