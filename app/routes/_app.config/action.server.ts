import { z } from "zod";
import { getServerClient } from "~/server";
import getGeocode from "~/weatherApi/GetGeocode";
import type { Route } from "../_app.config/+types/route";

const ConfigFormSchema = z.object({
  firstname: z.string({ message: "Please enter a valid name." }),
  lastname: z.string({ message: "Please enter a valid name." }),
  location: z.string(),
  email: z.email({ message: "Please enter a valid e-mail address." }),
  password: z.string({ message: "Please enter a valid e-mail address." }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const {
    success,
    data: payload,
    error,
  } = ConfigFormSchema.safeParse(
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
    const supabaseServerClient = getServerClient(request);
    const { error: dBError } =
      await supabaseServerClient.client.auth.updateUser({
        email: payload.email,
        data: {
          location: payload.location,
          firstname: payload.firstname,
          lastname: payload.lastname,
          latitude: locationValidation.lat,
          longitude: locationValidation.lng,
        },
      });
    return { dBError };
  }

  return { geocodeApiError, invalidLocation };
}
