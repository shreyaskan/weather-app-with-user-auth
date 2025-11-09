import { Form, redirect } from "react-router";
import { data as returnData } from "react-router";
import { supabase } from "../supabase-client";
import type { Route } from "./+types/register";
import { Link } from "react-router";
import { getServerClient } from "~/server";
import getGeocode from "../weather/GetGeocode";

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

  const passwordMismatchError = !actionData?.isPasswordSame;

  const existingUser = actionData?.existingUser;
  const invalidLocation = actionData?.invalidLocation;
  const isApiError = actionData?.isApiError;

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#9a9ade] text-[black]">
      <div className="flex flex-col items-center justify-center py-4 rounded-md bg-[#e9e992] w-[35%]">
        <div className="text-2xl mx-20">Register</div>
        {existingUser && (
          <p className="text-red-400 m-4">
            A user with this e-mail address already exists. Please log in{" "}
            <Link to="/login" className="text-[blue] underline inline-block">
              here
            </Link>
            .
          </p>
        )}
        {invalidLocation && (
          <p className="text-red-400 m-4">
            The location you've entered is invalid. Please try again.
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
          {/* {passwordMismatchError && (
            <p className="text-red-400">
              The passwords don't match. Please try again.
            </p>
          )} */}
          <button
            type="submit"
            className="bg-[white] py-2 px-6 my-4 rounded-xl"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
