"use client";

import { loginAction } from "@/server/actions/auth";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <form action={formAction}>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <input type="hidden" name="redirectTo" value={from || "/dashboard"} />
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">{isPending ? "Logging in..." : "Login"}</button>
    </form>
  );
}

export default LoginForm;
