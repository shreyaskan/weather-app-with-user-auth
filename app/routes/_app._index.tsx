import type { MetaFunction } from "react-router";
import { redirect } from "react-router";
import { getServerClient } from "~/server";
import Logo from "~/ui/components/Logo";
import NavBar from "~/ui/components/NavBar";
import type { Route } from "./+types/_app._index";

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

    if (userResponse?.data?.user) {
      throw redirect("/home", { headers: sbServerCient.headers });
    }
  } catch (error) {
    console.log("Supabase client error:", error);
  }
}

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#222222]">
      <NavBar showLogin showRegister />
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <Logo />
        <h1 className="mt-16 p-8 rounded-2xl text-[2rem] bg-[#169976]">
          Your Personalised Weather Dashboard
        </h1>
      </div>
    </div>
  );
}
