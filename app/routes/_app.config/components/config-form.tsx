import { useState } from "react";
import React from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useActionData, useFetcher, useLoaderData } from "react-router";
import { useForm } from "react-hook-form";

export default function ConfigForm() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  const actionData = useActionData();

  const invalidLocation = actionData?.invalidLocation;
  const geocodeApiError = actionData?.geocodeApiError;
  const dBError = actionData?.dBError;
  const validationError = actionData?.validationError;

  const { userMetadata } = useLoaderData();

  const firstname = userMetadata?.firstname;
  const lastname = userMetadata?.lastname;
  const location = userMetadata?.location;
  const email = userMetadata?.email;

  const userDetails = [
    { label: "First Name", data: firstname, name: "firstname" },
    { label: "Last Name", data: lastname, name: "lastname" },
    { label: "Location", data: location, name: "location" },
    { label: "E-mail Address", data: email, name: "email" },
  ];

  const fetcher = useFetcher();

  function onSubmit(formData: any) {
    setEditMode(false);
    fetcher.submit(formData, { method: "POST" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center bg-[#222222] w-3/4 lg:w-1/2 border-none mx-8 my-8 px-8 py-8 h-full rounded-xl"
    >
      <h2 className="text-3xl mb-8"> Your Details</h2>
      <div className="w-full text-right">
        <button
          hidden={!editMode}
          className="ml-2 p-2 rounded-md  text-red-500"
          onClick={() => setEditMode(false)}
          type="button"
        >
          Cancel
        </button>
        {!editMode && (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="bg-[#1DCD9F] text-[#222222] text-md py-2 px-4 rounded-md"
          >
            <ModeEditIcon sx={{ fontSize: "1.5rem", paddingRight: "0.5rem" }} />
            Edit
          </button>
        )}
        {editMode && (
          <button
            type="submit"
            className="bg-[#1DCD9F] text-[#222222] text-md py-2 px-4 rounded-md"
          >
            <SaveAsIcon sx={{ fontSize: "1.5rem", paddingRight: "0.5rem" }} />
            Save
          </button>
        )}
      </div>
      <div className="flex w-full text-[#1DCD9F] justify-around text-left mt-2">
        <div className="flex flex-col">
          {userDetails.map((field, index) => {
            return (
              <div
                key={`config-fields-${index}`}
                className="mr-4 p-2 my-2 rounded-md"
              >
                {field.label}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-1/2">
          {userDetails.map((field, index) => {
            return (
              <React.Fragment key={`config-inputs-${index}`}>
                <input
                  disabled={!editMode}
                  {...register(field.name)}
                  className={`p-2 my-2 rounded-md ${editMode ? "bg-[#111111]" : "bg-[#222222]"}`}
                  defaultValue={field.data}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </form>
  );
}
