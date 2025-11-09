import type { Route } from "./+types/home";
import type { MetaFunction } from "react-router";
import { redirect } from "react-router";
import { getServerClient } from "~/server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Welcome to your personalised weather app",
    },
    {
      name: "Description",
      content:
        "This personalised weather app is built using React Router 7 and Supabase ORM",
    },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const sbServerCient = getServerClient(request);
    const userResponse = await sbServerCient.client.auth.getUser();

    if (!userResponse?.data?.user) {
      throw redirect("/login", { headers: sbServerCient.headers });
    } else {
      throw redirect("/home", { headers: sbServerCient.headers });
    }
  } catch (error) {
    console.log("Error:", error);
    throw redirect("/login", { headers: {} });
  }
}
