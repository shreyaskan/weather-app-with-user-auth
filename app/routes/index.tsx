import type { Route } from "./+types/home";
import type { MetaFunction } from "react-router";
import { redirect, Link } from "react-router";
import { getServerClient } from "~/server";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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

export default function index() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#222222]">
      <nav className="flex justify-end pt-2 bg-[#222222]">
        <div className="flex">
          <div className="my-2 mx-6 px-4 py-2 rounded-md bg-[#169976]">
            <PersonIcon sx={{ marginRight: "0.5rem" }} />
            <Link to="/login">Login</Link>
          </div>
          <div className="m-2 px-4 py-2 rounded-md bg-[#169976]">
            <PersonAddIcon sx={{ marginRight: "0.5rem" }} />
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex mt-20">
          <WbSunnyOutlinedIcon
            sx={{
              color: "#222222",
              fontSize: "4rem",
              marginLeft: "3rem",
              marginRight: "3rem",
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          />
          <CloudOutlinedIcon
            sx={{
              color: "#222222",
              fontSize: "4rem",
              marginLeft: "3rem",
              marginRight: "3rem",
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          />
          <AcUnitOutlinedIcon
            sx={{
              color: "#222222",
              fontSize: "4rem",
              marginLeft: "3rem",
              marginRight: "3rem",
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          />
        </div>
        <h1 className="mt-16 p-8 rounded-2xl text-[2rem] bg-[#169976]">
          Your Personalised Weather Dashboard
        </h1>
      </div>
    </div>
  );
}
