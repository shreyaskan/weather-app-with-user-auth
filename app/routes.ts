import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/home", "routes/home.tsx"),
] satisfies RouteConfig;
