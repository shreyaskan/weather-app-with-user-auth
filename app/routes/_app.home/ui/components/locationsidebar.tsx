import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationForm from "./add-location-form";

export default function LocationSidebar({
  locationData,
  setSelectedLocation,
}: any) {
  // useEffect(() => {
  //   if (locationError === undefined) {
  //     setIsAddingLocation(false);
  //   }
  // }, [locationError]);

  const [showDelete, setShowDelete] = useState(null);
  const [addNewLocation, setAddNewLocation] = useState(false);

  function onLocationClick(location: any) {
    setSelectedLocation(location);
    setShowDelete(location);
  }

  async function onDelete(location: any) {
    // need to get user's email too, do it in action function
    // await supabase.from("locations").delete().eq("location", location);
  }

  return (
    <div className="flex flex-col items-center justify-start min-w-fit w-1/3 bg-[#222222] h-screen text-whitesmoke md:w-60">
      <h2 className=" pt-8">Other Locations</h2>
      <div className="flex flex-col items-start justify-start mt-4">
        {locationData &&
          locationData.map((location: any, index: any) => {
            return (
              <div>
                <button
                  key={`location-list-${index}`}
                  className="p-2 m-2 border-[#169976] border-2 rounded-md cursor-pointer"
                  onClick={() => onLocationClick(location.location)}
                >
                  {location.location}
                </button>
                {showDelete === location.location && (
                  <button
                    hidden={location.location === showDelete}
                    className="p-2 m-2 border-[#169976] border-2 rounded-md cursor-pointer"
                    onClick={() => onDelete(location.location)}
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                  </button>
                )}
              </div>
            );
          })}
      </div>
      {addNewLocation ? (
        <AddLocationForm setAddNewLocation={setAddNewLocation} />
      ) : (
        <button
          type="button"
          className="bg-[#169976] mt-6 p-2 rounded-md max-w-fit"
          onClick={() => setAddNewLocation(true)}
        >
          + Add Location
        </button>
      )}
    </div>
  );
}
