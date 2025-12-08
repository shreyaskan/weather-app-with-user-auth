import { supabase } from "~/supabase-client";
import { getServerClient } from "~/server";
import getGeocode from "~/weatherApi/GetGeocode";

// export async function action({ request }: Route.ActionArgs) {
export async function action({ request }: any) {
  try {
    const formData = await request.formData();

    // const formFields = Object.fromEntries(Array.from(formData.entries()));
    const formFields = {
      firstname: "Shreyas",
      lastname: "kan",
      email: "shreyas@gmail.com",
      location: "bengaluru",
      passwordone: "password",
      passwordtwo: "password",
    };

    const { firstname, lastname, email, location, passwordone, passwordtwo } =
      formFields;

    let isPasswordSame = passwordone === passwordtwo;

    const { data } = await supabase
      .from("auth.users")
      .select("email")
      .eq("email", email)
      .single();

    let existingUser = data !== null;

    const geocode = await getGeocode(location);

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
        console.log("New user has been created in the database:", formFields);
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
