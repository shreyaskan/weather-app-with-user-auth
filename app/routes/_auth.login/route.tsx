import { useActionData, useSearchParams } from "react-router";
import { loader } from "./loader.server";
import NavBar from "~/ui/components/NavBar";
import LoginForm from "./components/login-form";
import { action } from "./action.server";

export { loader, action };

export default function Login() {
  const [searchParams] = useSearchParams();
  const existingUser = searchParams.get("error") === "existing-user";

  const actionData = useActionData() || {};
  const loginError = actionData.loginError;

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <NavBar showRegister />
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#000000] text-[#222222]">
        <div className="flex flex-col items-center mt-16 pb-10 px-16 rounded-2xl bg-[#169976]">
          <h1 className="rounded-2xl text-[2rem] py-10">
            Check the weather where you are!
          </h1>
          <LoginForm existingUser={existingUser} loginError={loginError} />
        </div>
      </div>
    </div>
  );
}
