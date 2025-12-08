import { redirect } from "react-router";
import { data as returnData } from "react-router";
import { getServerClient } from "~/server";

// export async function loader({ request }: Route.LoaderArgs) {
export async function loader({ request }: any) {
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
