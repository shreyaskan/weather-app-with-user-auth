import { getServerClient } from "~/server";
import { redirect } from "react-router";
import { supabase } from "~/supabase-client";
import getGeocode from "~/weatherApi/GetGeocode";
import type { Route } from "../_app.home/+types/route";

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const actionType = formData._action;

  const supabaseClient = getServerClient(request);
  const userResponse = await supabaseClient.client.auth.getUser();
  const userEmail = userResponse?.data?.user?.email;

  if (actionType === "logout") {
    await supabaseClient.client.auth.signOut();
    return redirect("/", { headers: supabaseClient.headers });
  }

  if (actionType === "addLocation") {
    const location = String(formData.location);
    const locationValidation = await getGeocode(location);
    let invalidLocation = locationValidation === "ZERO_RESULTS";
    let geocodeApiError = locationValidation === "Error";

    if (!invalidLocation && !geocodeApiError) {
      const { error } = await supabase.from("locations").insert({
        useremail: userEmail,
        location: location,
        latitude: locationValidation.lat,
        longitude: locationValidation.lng,
      });

      return { error };
    }

    return { geocodeApiError, invalidLocation };
  }
}
