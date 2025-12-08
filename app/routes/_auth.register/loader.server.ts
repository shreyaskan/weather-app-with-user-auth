import { redirect } from "react-router";
import { data as returnData } from "react-router";
import { getServerClient } from "~/server";
import type { Route } from "../_auth.register/+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();

  if (userResponse?.data?.user) {
    throw redirect("/home", { headers: supabaseServerClient.headers });
  }

  return returnData(
    { user: null, error: null },
    { headers: supabaseServerClient.headers }
  );
}
