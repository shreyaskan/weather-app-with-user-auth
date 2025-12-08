import { getServerClient } from "~/server";
import { data, redirect } from "react-router";
import { supabase } from "~/supabase-client";
import getGeocode from "~/weatherApi/GetGeocode";
import type { Route } from "../_app.home/+types/route";

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const actionType = formData._action;

  const supabaseClient = getServerClient(request);
  const userResponse = await supabaseClient.client.auth.getUser();
  const userEmail = userResponse?.data?.user?.email;

  try {
    if (actionType === "logout") {
      await supabaseClient.client.auth.signOut();
      return redirect("/", { headers: supabaseClient.headers });
    }

    if (actionType === "addLocation") {
      const location = String(formData.location);
      const geocode = await getGeocode(location);
      const latitude = geocode.lat;
      const longitude = geocode.lng;
      let invalidLocation = geocode === "ZERO_RESULTS";
      let isApiError = geocode === "Error";

      if (!invalidLocation && !isApiError) {
        const { error } = await supabase.from("locations").insert({
          useremail: userEmail,
          location: String(location),
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
        if (!error) {
          console.log("New location added:", location);
          return data({ error: undefined, success: true });
        } else if (error) {
          console.log("Error updating the database:", error?.message);
          return data({ error: error.message, success: false });
        }
      }

      if (isApiError) {
        console.error("API Error, check your Google API Key/connection.");
        return data({
          error: "Google API Key error",
          success: false,
        });
      }

      if (invalidLocation) {
        console.log("Invalid location");
        return data({
          error: "Invalid location, please try again",
          success: false,
        });
      }
      return data(
        { success: true, message: "Location added", error: false },
        { headers: supabaseClient.headers }
      );
    }
  } catch (error) {
    console.error(error);
    return data(
      { error: "Failed to process action" },
      { headers: supabaseClient.headers }
    );
  }
}
