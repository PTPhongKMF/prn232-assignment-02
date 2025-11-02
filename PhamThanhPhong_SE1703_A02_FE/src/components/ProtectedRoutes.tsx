import type { ParentProps } from "solid-js";
import { Navigate } from "@solidjs/router";
import { createMemo } from "solid-js";
import { user } from "../stores/user-store.ts";
import type { JSXElement } from "solid-js";
import { Show } from "solid-js";

interface ProtectedRouteProps extends ParentProps {
  allowedRoles: number[];
}

export default function ProtectedRoutes(
  props: ProtectedRouteProps,
): JSXElement {
  const allowed = createMemo(() => {
    const u = user();
    if (!u) return false;

    return props.allowedRoles.includes(u.accountRole);
  });

  return (
    <Show when={allowed()} fallback={<Navigate href="./" />}>
      {props.children}
    </Show>
  );
}
