import { Form, redirect } from "react-router";
import { data as returnData } from "react-router";
import { supabase } from "../supabase-client";
import type { Route } from "./+types/register";
import { Link } from "react-router";
import { getServerClient } from "~/server";
import getGeocode from "../weather/GetGeocode";
import PersonIcon from "@mui/icons-material/Person";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";

export async function loader({ request }: Route.LoaderArgs) {
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

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const dataFields = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );

    const { firstname, lastname, email, location, passwordone, passwordtwo } =
      dataFields;

    let isPasswordSame = passwordone === passwordtwo;

    console.log("passwordone", passwordone);

    const { data } = await supabase
      .from("auth.users")
      .select("email")
      .eq("email", email)
      .single();

    let existingUser = data !== null;

    const geocode = await getGeocode("London");

    let invalidLocation = geocode === "ZERO_RESULTS";
    let isApiError = geocode === "Error";

    if (!invalidLocation && !isApiError) {
      const supabaseServerClient = getServerClient(request);
      const { data: signUpData, error } =
        await supabaseServerClient.client.auth.signUp({
          email: email,
          password: passwordone,
          options: {
            emailRedirectTo: "/home",
            data: {
              firstname: firstname,
              lastname: lastname,
              location: location,
              lattitude: geocode.lat,
              longitude: geocode.lng,
            },
          },
        });
      if (isPasswordSame && !existingUser && !error) {
        console.log("New user has been created in the database:", dataFields);
        return {
          user: signUpData?.user,
          headers: supabaseServerClient.headers,
        };
      } else if (error) {
        console.log("Sign up error:", error?.message);
        return {
          error: error.message,
          headers: supabaseServerClient.headers,
        };
      }
    }

    if (isApiError) {
      console.error("API Error, check your Google API Key/connection.");
    }

    return {
      isPasswordSame: isPasswordSame,
      existingUser: existingUser,
      invalidLocation: invalidLocation,
      isApiError: isApiError,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  const error = actionData
    ? (actionData as { error: string | null })?.error
    : null;

  const passwordMismatchError =
    actionData === undefined ? undefined : !actionData.isPasswordSame;

  const existingUser = actionData?.existingUser;
  const invalidLocation = actionData?.invalidLocation;
  const isApiError = actionData?.isApiError;

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
          <PersonIcon sx={{ marginRight: "0.5rem" }} />
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex flex-col items-center mt-10 pb-10 px-16 rounded-2xl bg-[#169976]">
          <h1 className="rounded-2xl text-[2rem] py-6">
            Create your new account here!
          </h1>
          <div className="flex flex-col items-center justify-center p-8 w-content rounded-md bg-[#1DCD9F]">
            <h2 className="text-2xl mx-20">Register Page</h2>
            {existingUser && (
              <p className="text-red-600 m-4">
                A user with this e-mail address already exists. Please log in{" "}
                <Link
                  to="/login"
                  className="text-[blue] underline inline-block"
                >
                  here
                </Link>
                .
              </p>
            )}
            {invalidLocation && (
              <p className="text-red-600 m-4">
                The location you've entered is invalid. Please try again.
              </p>
            )}
            {isApiError && (
              <p className="text-red-600 m-4">
                Location validation isn't working currently, please try again
                later.
              </p>
            )}
            <Form
              method="post"
              className="flex flex-col pt-10 justify-start items-start"
            >
              <label>First Name</label>
              <input
                name="firstname"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="John"
                type="text"
                required
              ></input>
              <label>Last Name</label>
              <input
                name="lastname"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="Smith"
                type="text"
                required
              ></input>
              <label>E-mail Address</label>
              <input
                name="email"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="abc@example.com"
                type="email"
                required
              ></input>
              <label>Location</label>
              <input
                name="location"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="New York"
                type="text"
                required
              ></input>
              <label>Password</label>
              <input
                name="passwordone"
                className="my-2 p-2 bg-[whitesmoke] rounded-md"
                type="password"
                required
              ></input>
              <label>Re enter your password</label>
              <input
                name="passwordtwo"
                className="my-2 p-2 bg-[whitesmoke] rounded-md"
                type="password"
                required
              ></input>
              {passwordMismatchError && (
                <p className="text-red-600">
                  The passwords don't match. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="bg-[#000000] text-[#1DCD9F] py-2 px-6 my-4 rounded-xl"
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
