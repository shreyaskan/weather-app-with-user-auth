import NavBar from "~/ui/components/NavBar";
import LocationSidebar from "./ui/components/locationsidebar";
import { useState } from "react";
import { action } from "./server.action";
import { loader } from "./server.loader";
import type { Route } from "../_app.home/+types/route";

export { action, loader };

export default function home({ loaderData, actionData }: Route.ComponentProps) {
  const location = loaderData?.userMetaData?.location;
  const latitude = loaderData?.userMetaData?.latitude;
  const longitude = loaderData?.userMetaData?.longitude;
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
