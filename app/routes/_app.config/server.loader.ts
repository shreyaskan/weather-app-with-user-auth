import { getServerClient } from "~/server";
import { data } from "react-router";
import type { Route } from "../_app.config/+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const user = userResponse?.data?.user;
  const userMetadata = user?.user_metadata;

  return data(
    {
      userMetadata: userMetadata,
    },
    { headers: supabaseServerClient.headers }
  );
}
