import { supabase } from "~/supabase-client";
import type { Route } from "./+types/dashboard";

export async function loader({ params }: Route.LoaderArgs) {
  //   const { id } = params;
  //   if (!id) {
  //     return { error: "No User Found" };
  //   }
  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("id", id)
  //     .single();
}

export default function Dashboard() {
  return <div></div>;
}
