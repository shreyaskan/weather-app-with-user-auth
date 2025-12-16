import NavBar from "~/ui/components/NavBar";
import LocationSidebar from "./ui/components/locationsidebar";
import { useState } from "react";
import { action } from "./action.server";
import { loader } from "./loader.server";
import { useLoaderData } from "react-router";

export { action, loader };

export default function home() {
  const loaderData = useLoaderData();
  const { location, latitude, longitude, lastname, firstname } =
    loaderData?.userMetaData;

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    loaderData?.userMetaData?.location
  );

  return (
    <>
      <NavBar showConfig showLogout setShowSidebar={setShowSidebar} />
      <div className="flex">
        {showSidebar && (
          <LocationSidebar
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        )}
        <div>
          Hi {firstname} {lastname}. You're from {location}, right?
          <br />
          You want to know the current weather in {selectedLocation} right?
        </div>
      </div>
    </>
  );
}
