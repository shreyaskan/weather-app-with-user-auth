import NavBar from "~/ui/components/NavBar";
import LocationSidebar from "./ui/components/locationsidebar";
import { useState } from "react";
import { action } from "./action.server";
import { loader } from "./loader.server";
import { useActionData, useLoaderData } from "react-router";

export { action, loader };

export default function home() {
  const loaderData = useLoaderData();
  const userMetaData = loaderData?.userMetaData;
  // const location = userMetaData?.location;
  // const latitude = userMetaData?.latitude;
  // const longitude = userMetaData?.longitude;

  const actionData = useActionData();
  const error = (actionData as { error: string | null })?.error;
  const locationError = actionData?.error;

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    loaderData?.userMetaData?.location
  );

  return (
    <>
      <NavBar showConfig showLogout setShowSidebar={setShowSidebar} />
      <div className=" flex">
        {showSidebar && (
          <LocationSidebar
            locationError={String(locationError)}
            setSelectedLocation={setSelectedLocation}
          />
        )}
        <div>
          Hi {loaderData?.userMetaData?.firstname}{" "}
          {loaderData?.userMetaData?.lastname}. You're from{" "}
          {loaderData?.userMetaData?.location}, right?
          <br />
          You want to know the current weather in {selectedLocation} right?
        </div>
      </div>
    </>
  );
}
