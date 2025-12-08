import NavBar from "~/ui/components/NavBar";
import { action } from "./action.server";
import { loader } from "./loader.server";
import ConfigForm from "./components/config-form";

export { action, loader };

export default function Config() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#1DCD9F]">
      <NavBar showLogout />
      <div className="flex flex-col items-center justify-center">
        <ConfigForm />
      </div>
    </div>
  );
}
