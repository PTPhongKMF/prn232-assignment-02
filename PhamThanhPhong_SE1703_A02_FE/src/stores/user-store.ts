import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import type { LoginResponse } from "../schemas/user.ts";

export const [user, setUser] = makePersisted(createSignal<LoginResponse>(), {
  storage: localStorage,
  name: "user",
  sync: storageSync,
});
