import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#9a9ade] text-[black]">
      Your Personalised Weather Dashboard
      <button className="my-4 p-2 bg-[lightyellow] rounded-xl">
        <Link to="/login">Login</Link>
      </button>
      <button className="my-4 p-2 bg-[lightyellow] rounded-xl">
        <Link to="/register">Register</Link>
      </button>
    </div>
  );
}
