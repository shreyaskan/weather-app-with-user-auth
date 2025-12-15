import { getServerClient } from "~/server";
import { data, redirect } from "react-router";
import { supabase } from "~/supabase-client";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const user = userResponse?.data?.user;
  const userMetaData = user?.user_metadata;
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("useremail", user?.email);

  if (userResponse.error || !userResponse.data.user) {
    throw redirect("/login", { headers: supabaseServerClient.headers });
  }

  return data(
    {
      user,
      locationData,
      userMetaData,
    },
    { headers: supabaseServerClient.headers }
  );
}
