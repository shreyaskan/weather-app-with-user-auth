import { getServerClient } from "~/server";
import type { Route } from "../_app.config/+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const user = userResponse?.data?.user;
  const userMetadata = user?.user_metadata;

  return { userMetadata };
}
