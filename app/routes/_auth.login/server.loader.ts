import { redirect, data } from "react-router";
import { getServerClient } from "~/server";
import type { Route } from "../_auth.login/+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.client.auth.getUser();

  if (userResponse?.data?.user) {
    throw redirect("/home", { headers: sbServerClient.headers });
  }

  return data(
    {
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
      },
    },
    { headers: sbServerClient.headers }
  );
}
