import { loader } from "./loader.server";
import { action } from "./action.server";
import type { Route } from "../_auth.register/+types/route";
import NavBar from "~/ui/components/NavBar";
import RegisterForm from "./components/register-form";

export { loader, action };

export default function Register({ actionData }: Route.ComponentProps) {
  const invalidLocation = actionData?.invalidLocation;
  const geocodeApiError = actionData?.geocodeApiError;

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <NavBar showLogin />
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex flex-col items-center mt-10 pb-10 px-16 rounded-2xl bg-[#169976]">
          <h1 className="rounded-2xl text-[2rem] py-6">
            Create your new account here!
          </h1>
          <div className="flex flex-col items-center justify-center p-8 w-content rounded-md bg-[#1DCD9F]">
            <h2 className="text-2xl mx-20">Register Page</h2>
            {invalidLocation && (
              <p className="text-red-600 m-4">
                The location you've entered is invalid. Please try again.
              </p>
            )}
            {geocodeApiError && (
              <p className="text-red-600 m-4">
                API Error, check your Google API Key/connection.
              </p>
            )}
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
