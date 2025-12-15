import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";

export default function AddLocationForm({
  setAddNewLocation,
}: {
  setAddNewLocation: any;
}) {
  const fetcher = useFetcher();
  const { handleSubmit, register } = useForm();

  function onSubmit(formData: any) {
    fetcher.submit(formData, { method: "POST", action: "/api/locations" });
    setAddNewLocation(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("location")}
        className="bg-white mt-6 p-2 rounded-md text-black"
      />
      <div className="text-right">
        <button
          className="bg-[#169976] mt-6 p-2 rounded-md max-w-fit"
          type="submit"
        >
          Add
        </button>
        <button
          className="ml-2 p-2 rounded-md bg-[#111111] text-red-500"
          type="button"
          onClick={() => setAddNewLocation(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
