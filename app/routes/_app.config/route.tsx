import { useState, useEffect } from "react";
import React from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Form } from "react-router";
import NavBar from "~/ui/components/NavBar";
import { action } from "./server.action";
import { loader } from "./server.loader";
import type { Route } from "../_app.config/+types/route";

export { action, loader };

export default function Config({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const error = actionData?.error;

  const [configState, setConfigState] = useState("details");
  const [editMode, setEditMode] = useState<boolean>(false);

  const firstname = loaderData?.userMetadata?.firstname;
  const lastname = loaderData?.userMetadata?.lastname;
  const location = loaderData?.userMetadata?.location;
  const email = loaderData?.userMetadata?.email;

  const userDetails = [
    { label: "First Name", data: firstname, name: "firstname" },
    { label: "Last Name", data: lastname, name: "lastname" },
    { label: "Location", data: location, name: "location" },
    { label: "E-mail Address", data: email, name: "email" },
  ];

  useEffect(() => {
    if (error === undefined) {
      setEditMode(false);
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <NavBar showLogout />
      <div className="flex">
        <div className="flex flex-col justify-center items-start bg-[#222222] w-1/4 border-none ml-2 my-8 px-8 py-8 h-full rounded-xl xs:min-w-fit">
          <button
            onClick={() => setConfigState("details")}
            className={`mx-2 my-2 px-2 py-2 ${configState === "details" && "bg-[#111111]"} rounded-md`}
          >
            Edit your details
          </button>
          <button
            onClick={() => setConfigState("password")}
            className={`mx-2 my-2 px-2 py-2 ${configState === "password" && "bg-[#111111]"} rounded-md`}
          >
            Password Reset
          </button>
        </div>
        {configState === "details" && (
          <Form
            method="post"
            className="flex flex-col justify-center items-center bg-[#222222] w-2/3 lg:w-1/3 border-none mx-8 my-8 px-8 py-8 h-full rounded-xl"
          >
            <h2 className="text-3xl mb-8"> Your Details</h2>
            {error && (
              <div className="text-xl mb-8 text-red-600">{String(error)}</div>
            )}
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
                  <ModeEditIcon
                    sx={{ fontSize: "1.5rem", paddingRight: "0.5rem" }}
                  />
                  Edit
                </button>
              )}
              {editMode && (
                <button
                  type="submit"
                  className="bg-[#1DCD9F] text-[#222222] text-md py-2 px-4 rounded-md"
                >
                  <SaveAsIcon
                    sx={{ fontSize: "1.5rem", paddingRight: "0.5rem" }}
                  />
                  Save
                </button>
              )}
            </div>
            <div className="flex w-full text-[#1DCD9F] justify-around text-left mt-2">
              <div className="flex flex-col">
                {userDetails.map((detail, index) => {
                  return (
                    <div key={index} className="mr-4 p-2 my-2 rounded-md">
                      {detail.label}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col w-1/2">
                {userDetails.map((detail: any) => {
                  return (
                    <React.Fragment key={detail.name}>
                      <input
                        disabled={!editMode}
                        name={detail.name}
                        className={`p-2 my-2 rounded-md bg-${editMode ? "[#111111]" : "[#222222]"}`}
                        defaultValue={detail.data}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
