import { Form, Link, useFetcher } from "react-router";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import PublicIcon from "@mui/icons-material/Public";
import { useForm } from "react-hook-form";

export default function NavBar({
  showLogin,
  showRegister,
  showLogout,
  showConfig,
  setShowSidebar,
}: {
  showLogin?: boolean;
  showRegister?: boolean;
  showLogout?: boolean;
  showConfig?: boolean;
  setShowSidebar?: any;
}) {
  const fetcher = useFetcher();

  function onSubmit() {
    const formData = new FormData();
    formData.append("_action", "logout");
    fetcher.submit(formData, { method: "post" });
  }
  return (
    <nav className="flex justify-between items-center pt-2 bg-[#222222]">
      <div className="flex m-2 px-4 py-2">
        <Link to="/home" className="">
          <WbSunnyOutlinedIcon sx={{ marginRight: "2rem" }} />
          <CloudOutlinedIcon sx={{ marginRight: "2rem" }} />
          <AcUnitOutlinedIcon />
        </Link>
      </div>
      <div className="flex">
        {showConfig && (
          <Link to="/config">
            <div className="m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222]">
              <PersonIcon />
            </div>
          </Link>
        )}
        {showConfig && (
          <button
            onClick={() => setShowSidebar((prevState: boolean) => !prevState)}
            className="m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222] cursor-pointer"
          >
            <PublicIcon />
          </button>
        )}
        {showRegister && (
          <Link
            to="/register"
            className="flex m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222]"
          >
            <PersonAddIcon sx={{ marginRight: "0.5rem" }} />
            Register
          </Link>
        )}
        {showLogin && (
          <Link
            to="/login"
            className="flex m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222] cursor-pointer"
          >
            <PersonIcon sx={{ marginRight: "0.5rem" }} />
            Login
          </Link>
        )}
        {showLogout && (
          <button
            name="_action"
            value="logout"
            type="button"
            onClick={onSubmit}
            className="flex m-2 px-4 py-2 rounded-md bg-[#169976] text-[#222222] cursor-pointer"
          >
            <LogoutIcon sx={{ marginRight: "0.5rem" }} /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
