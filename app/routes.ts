import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  route("/home", "routes/home/index.tsx"),
  route("/config", "routes/config/index.tsx"),
] satisfies RouteConfig;
