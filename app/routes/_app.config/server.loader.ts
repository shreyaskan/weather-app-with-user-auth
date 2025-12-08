import { getServerClient } from "~/server";
import { data } from "react-router";

export async function loader({ request }: any) {
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
