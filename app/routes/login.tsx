import {
  Form,
  Link,
  redirect,
  useNavigate,
  type MetaFunction,
  data,
} from "react-router";
import type { Route } from "./+types/login";
import { getServerClient } from "~/server";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - New React Router Supabase App" },
    {
      name: "description",
      content: "Login to your account in React Router with Supabase!",
    },
  ];
};

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

export default function Login({ loaderData }: Route.ComponentProps) {
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
    <div className="flex items-center justify-center h-screen w-screen bg-[#9a9ade] text-[black]">
      <div className="flex flex-col items-center justify-center p-8 w-[20%] max-w-[30%] rounded-md bg-[#e9e992]">
        <div className="text-2xl mx-20">Login Page</div>

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
            className="bg-[white] py-2 px-6 my-4 rounded-xl"
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
          <Link to="/register" className="text-[blue] underline inline-block">
            here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
