import { getServerClient } from "~/server";
import { redirect } from "react-router";
import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  const supabaseServerClient = getServerClient(request);
  await supabaseServerClient.client.auth.signOut();

  return redirect("/", { headers: supabaseServerClient.headers });
}
