import { getServerClient } from "~/server";
import { data } from "react-router";
import getGeocode from "~/weatherApi/GetGeocode";
import type { Route } from "../_app.config/+types/route";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = Object.fromEntries(await request.formData());

    const geocode = await getGeocode(String(formData.location));

    let invalidLocation = geocode === "ZERO_RESULTS";
    let isApiError = geocode === "Error";

    if (!invalidLocation && !isApiError) {
      const supabaseServerClient = getServerClient(request);
      const { error } = await supabaseServerClient.client.auth.updateUser({
        email: String(formData.email),
        data: {
          location: String(formData.location),
          firstname: String(formData.firstname),
          lastname: String(formData.lastname),
          latitude: String(geocode.lat),
          longitude: String(geocode.lng),
        },
      });
      if (!error) {
        console.log("Updated User Details:", formData);
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
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message, success: false });
    }
    return { error: "An unknown error occurred", success: false };
  }
}
