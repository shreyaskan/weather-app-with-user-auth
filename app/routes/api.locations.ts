import { getServerClient } from "~/server";
import { supabase } from "~/supabase-client";
import getGeocode from "~/weatherApi/GetGeocode";
import { z } from "zod";
import type { Route } from "./+types/api.locations";

const AddLocationFormSchema = z.object({
  location: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const userEmail = userResponse?.data?.user?.email;

  const {
    success,
    data: payload,
    error,
  } = AddLocationFormSchema.safeParse(
    Object.fromEntries(Array.from(formData.entries()))
  );

  const locationValidation = await getGeocode(payload?.location as string);

  if (error?.message) {
    console.error("Form Validation error:", error.message);
    return { validationError: error.message };
  }

  const geocodeApiError = locationValidation === "Error";
  const invalidLocation = locationValidation === "ZERO_RESULTS";

  if (success && !invalidLocation && !geocodeApiError) {
    const { error: dBError } = await supabase.from("locations").insert({
      useremail: userEmail,
      location,
      latitude: locationValidation.lat,
      longitude: locationValidation.lng,
    });
    return { dBError };
  }

  return { geocodeApiError, invalidLocation };
}

export default function Route() {
  return null;
}
