import NavBar from "~/ui/components/NavBar";
import LocationSidebar from "./ui/components/locationsidebar";
import { useState } from "react";
import { action } from "./server.action";
import { loader } from "./server.loader";
import type { Route } from "../_app.home/+types/route";

export { action, loader };

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
