import { useState, useEffect } from "react";
import { Form } from "react-router";

export default function LocationSidebar({
  locationData,
  locationError,
  setSelectedLocation,
}: any) {
  // useEffect(() => {
  //   if (locationError === undefined) {
  //     setIsAddingLocation(false);
  //   }
  // }, [locationError]);

  return (
    <div className="flex flex-col items-center justify-start min-w-fit w-1/3 bg-[#222222] h-screen text-whitesmoke md:w-60">
      <div>Hi</div>
      <h2 className=" pt-8">Other Locations</h2>
      <div className="flex flex-col items-start justify-start mt-4">
        {locationData.map((location: any, index: any) => {
          return (
            <button
              className="p-2 m-2 border-[#169976] border-2 rounded-md"
              onClick={() => setSelectedLocation(location.location)}
              key={index}
            >
              {location.location}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="bg-[#169976] mt-6 p-2 rounded-md max-w-fit"
      >
        + Add Location
      </button>
    </div>
  );
}
