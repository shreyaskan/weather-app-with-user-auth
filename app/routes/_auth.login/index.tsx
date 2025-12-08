import { Form, Link, useNavigate, type MetaFunction } from "react-router";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import { loader } from "./server.loader";

export { loader };

export const meta: MetaFunction = () => {
  return [
    { title: "Login - New React Router Supabase App" },
    {
      name: "description",
      content: "Login to your account in React Router with Supabase!",
    },
  ];
};

// export default function Login({ loaderData }: Route.ComponentProps) {
export default function Login({ loaderData }: any) {
  const [error, setError] = useState<string | null>(null);
  const { env } = loaderData;
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataFields = Object.fromEntries(formData.entries());

    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(dataFields.email),
      password: String(dataFields.password),
    });

    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate("/home");
    }
  };

  function handleForgottenPassword() {
    return;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <nav className="flex justify-between items-center pt-2 bg-[#222222]">
        <div className="flex m-2 px-4 py-2">
          <Link to="/">
            <WbSunnyOutlinedIcon sx={{ marginRight: "2rem" }} />
            <CloudOutlinedIcon sx={{ marginRight: "2rem" }} />
            <AcUnitOutlinedIcon />
          </Link>
        </div>
        <div className="flex m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222]">
          <PersonAddIcon sx={{ marginRight: "0.5rem" }} />
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex flex-col items-center mt-16 pb-10 px-16 rounded-2xl bg-[#169976]">
          <h1 className="rounded-2xl text-[2rem] py-10">
            Check the weather where you are!
          </h1>
          <div className="flex flex-col items-center justify-center p-8 w-content rounded-md bg-[#1DCD9F]">
            <h2 className="text-2xl mx-20">Login Page</h2>
            {error && <p className="text-red-600 mt-4">{error}</p>}
            <Form
              method="post"
              onSubmit={handleSubmit}
              className="flex flex-col pt-10 justify-start items-start"
            >
              <label htmlFor="email">E-mail Address</label>
              <input
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="abc@example.com"
                id="email"
                name="email"
                type="email"
              ></input>
              <label htmlFor="password">Password</label>
              <input
                className="my-2 p-2 bg-[whitesmoke] rounded-md"
                id="password"
                name="password"
                type="password"
              ></input>
              <button
                type="submit"
                className="bg-[#000000] text-[#1DCD9F] py-2 px-6 my-4 rounded-xl"
              >
                Submit
              </button>
            </Form>
            <a
              href="/"
              className="text-red-600 pb-4 underline"
              onClick={handleForgottenPassword}
            >
              Forgotten Password?
            </a>

            <p>
              If you're new, register{" "}
              <Link
                to="/register"
                className="text-[blue] underline inline-block"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
