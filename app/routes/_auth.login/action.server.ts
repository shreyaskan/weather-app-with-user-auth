import { redirect } from "react-router";
import type { Route } from "../_auth.login/+types/route";
import z from "zod";
import { getServerClient } from "~/server";

const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const {
    success,
    data: payload,
    error: formValidationError,
  } = LoginFormSchema.safeParse(
    Object.fromEntries(Array.from(formData.entries()))
  );

  if (!success) {
    console.error("Form Validation error:", formValidationError.message);
    return { loginError: formValidationError.message };
  }

  const supabase = getServerClient(request);

  const { data, error: loginError } =
    await supabase.client.auth.signInWithPassword({
      email: payload?.email,
      password: payload?.password,
    });

  if (data.session) {
    return redirect("/home", { headers: supabase.headers });
  }

  console.log(loginError);

  return { loginError: loginError?.message || "Login failed" };
}
