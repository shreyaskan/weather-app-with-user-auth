import { useForm } from "react-hook-form";
import React from "react";
import { registerFields } from "./register-fields";
import { useFetcher } from "react-router";

export default function RegisterForm() {
  const { register, handleSubmit } = useForm();

  const fetcher = useFetcher();

  function onSubmit(formData: any) {
    fetcher.submit(formData, { method: "POST" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col pt-10 justify-start items-start"
    >
      {registerFields.map((field, index) => {
        return (
          <React.Fragment key={`register-fields-${index}`}>
            <label>{field.label}</label>
            <input
              {...register(field.name)}
              className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
              placeholder={field.placeholder}
              type={field.type}
              required
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
  );
}
