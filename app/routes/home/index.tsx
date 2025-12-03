import { getServerClient } from "~/server";
import type { Route } from "../home/+types/index";
import { data, redirect } from "react-router";
import NavBar from "~/ui/components/NavBar";
import Dashboard from "./ui/components/dashboard";
import LocationSidebar from "./ui/components/locationsidebar";
import { supabase } from "~/supabase-client";
import getGeocode from "~/weather/GetGeocode";
import { useState } from "react";
import { error } from "console";

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const user = userResponse?.data?.user;
  const userMetaData = user?.user_metadata;
  const locationData = await supabase
    .from("locations")
    .select("*")
    .eq("useremail", user?.email);

  if (userResponse.error || !userResponse.data.user) {
    throw redirect("/login", { headers: supabaseServerClient.headers });
  }

  return data(
    {
      user: userResponse?.data?.user || null,
      locationData: locationData.data,
      userMetaData: userMetaData,
    },
    { headers: supabaseServerClient.headers }
  );
}

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
        { success: true, message: "Location added", error: error },
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

export default function home({ loaderData, actionData }: Route.ComponentProps) {
  const userMetaData = loaderData?.userMetaData;
  const location = userMetaData?.location;
  const latitude = userMetaData?.latitude;
  const longitude = userMetaData?.longitude;
  const error = (actionData as { error: string | null })?.error;
  const locationData = loaderData?.locationData;
  const locationError = actionData?.error;

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    userMetaData?.location
  );

  return (
    <>
      <NavBar showConfig showLogout setShowSidebar={setShowSidebar} />
      <div className=" flex">
        {showSidebar && (
          <LocationSidebar
            locationData={locationData}
            locationError={String(locationError)}
            setSelectedLocation={setSelectedLocation}
          />
        )}
        <div>
          Hi {userMetaData?.firstname} {userMetaData?.lastname}. You're from{" "}
          {userMetaData?.location}, right?
          <br />
          You want to know the current weather in {selectedLocation} right?
        </div>
        {/* <Dashboard location={location} latitude={latitude} longitude={longitude}/> */}
      </div>
    </>
  );
}
