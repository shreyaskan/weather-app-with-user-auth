import { useForm } from "react-hook-form";
import { Link, useFetcher } from "react-router";
import { loginFields } from "./login-fields";
import React from "react";

export default function LoginForm({
  existingUser,
  loginError,
}: {
  existingUser: boolean;
  loginError: string;
}) {
  const { register, handleSubmit } = useForm();
  const fetcher = useFetcher();

  function onSubmit(formData: any) {
    fetcher.submit(formData, { method: "POST" });
  }
  return (
    <div className="flex flex-col items-center justify-center p-8 w-content rounded-md bg-[#1DCD9F]">
      <h2 className="text-2xl mx-20">Login Page</h2>
      {existingUser && (
        <p className="text-red-600 mt-4">
          You already have an account, please sign in below.
        </p>
      )}
      {loginError && <p className="text-red-600 mt-4">{loginError}</p>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col pt-10 justify-start items-start"
      >
        {loginFields.map((field, index) => {
          return (
            <React.Fragment key={`login-fields-${index}`}>
              <label htmlFor={field.label}>{field.label}</label>
              <input
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                {...register(field.name)}
                type={field.type}
              ></input>
            </React.Fragment>
          );
        })}
        <button
          type="submit"
          className="bg-[#000000] text-[#1DCD9F] py-2 px-6 my-4 rounded-xl"
        >
          Submit
        </button>
      </form>

      <p>
        If you're new, register{" "}
        <Link to="/register" className="text-[blue] underline inline-block">
          here
        </Link>
        .
      </p>
    </div>
  );
}
