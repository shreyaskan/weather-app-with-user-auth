import { Form } from "react-router";
import { Link } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import { loader } from "./server.loader";

export { loader };

// export default function Register({ actionData }: Route.ComponentProps) {
export default function Register({ actionData }: any) {
  const error = actionData
    ? (actionData as { error: string | null })?.error
    : null;

  const passwordMismatchError =
    actionData === undefined ? undefined : !actionData.isPasswordSame;

  const existingUser = actionData?.existingUser;
  const invalidLocation = actionData?.invalidLocation;
  const isApiError = actionData?.isApiError;

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <nav className="flex justify-between items-center pt-2 bg-[#222222]">
        <div className="flex m-2 px-4 py-2">
          <Link to="/">
            <WbSunnyOutlinedIcon sx={{ marginRight: "2rem" }} />
            <CloudOutlinedIcon sx={{ marginRight: "2rem" }} />
            <AcUnitOutlinedIcon />
          </Link>
        </div>
        <div className="flex m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222]">
          <PersonIcon sx={{ marginRight: "0.5rem" }} />
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex flex-col items-center mt-10 pb-10 px-16 rounded-2xl bg-[#169976]">
          <h1 className="rounded-2xl text-[2rem] py-6">
            Create your new account here!
          </h1>
          <div className="flex flex-col items-center justify-center p-8 w-content rounded-md bg-[#1DCD9F]">
            <h2 className="text-2xl mx-20">Register Page</h2>
            {existingUser && (
              <p className="text-red-600 m-4">
                A user with this e-mail address already exists. Please log in{" "}
                <Link
                  to="/login"
                  className="text-[blue] underline inline-block"
                >
                  here
                </Link>
                .
              </p>
            )}
            {invalidLocation && (
              <p className="text-red-600 m-4">
                The location you've entered is invalid. Please try again.
              </p>
            )}
            {isApiError && (
              <p className="text-red-600 m-4">
                Location validation isn't working currently, please try again
                later.
              </p>
            )}
            <Form
              method="post"
              className="flex flex-col pt-10 justify-start items-start"
            >
              <label>First Name</label>
              <input
                name="firstname"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="John"
                type="text"
                required
              ></input>
              <label>Last Name</label>
              <input
                name="lastname"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="Smith"
                type="text"
                required
              ></input>
              <label>E-mail Address</label>
              <input
                name="email"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="abc@example.com"
                type="email"
                required
              ></input>
              <label>Location</label>
              <input
                name="location"
                className="my-2 p-2 mb-6 bg-[whitesmoke] rounded-md"
                placeholder="New York"
                type="text"
                required
              ></input>
              <label>Password</label>
              <input
                name="passwordone"
                className="my-2 p-2 bg-[whitesmoke] rounded-md"
                type="password"
                required
              ></input>
              <label>Re enter your password</label>
              <input
                name="passwordtwo"
                className="my-2 p-2 bg-[whitesmoke] rounded-md"
                type="password"
                required
              ></input>
              {passwordMismatchError && (
                <p className="text-red-600">
                  The passwords don't match. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="bg-[#000000] text-[#1DCD9F] py-2 px-6 my-4 rounded-xl"
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
