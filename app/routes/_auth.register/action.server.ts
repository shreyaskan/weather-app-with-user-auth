import { supabase } from "~/supabase-client";
import { getServerClient } from "~/server";
import getGeocode from "~/weatherApi/GetGeocode";
import type { Route } from "../_auth.register/+types/route";
import { z } from "zod";
import { redirect } from "react-router";

const RegisterFormSchema = z.object({
  firstname: z.string({ message: "Please enter a valid first name." }),
  lastname: z.string({ message: "Please enter a valid last name." }),
  email: z.email({ message: "Please enter a valid e-mail address." }),
  location: z.string(),
  password: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const {
    success,
    data: payload,
    error,
  } = RegisterFormSchema.safeParse(
    Object.fromEntries(Array.from(formData.entries()))
  );

  const locationValidation = await getGeocode(payload?.location as string);

  if (error?.message) {
    console.log("Form Validation error:", error.message);
  }

  const geocodeApiError = locationValidation === "Error";
  const invalidLocation = locationValidation === "ZERO_RESULTS";

  if (success && !invalidLocation && !geocodeApiError) {
    const supabaseServerClient = getServerClient(request);
    const { data, error } = await supabaseServerClient.client.auth.signUp({
      email: payload?.email,
      password: payload?.password,
      options: {
        emailRedirectTo: "/home",
        data: {
          firstname: payload?.firstname,
          lastname: payload?.lastname,
          location: payload.location,
          lattitude: locationValidation.lat,
          longitude: locationValidation.lng,
        },
      },
    });

    if (!error && data.user === null) {
      return redirect("/login?error=existing-user");
    }
  }

  return { geocodeApiError, invalidLocation };
}
