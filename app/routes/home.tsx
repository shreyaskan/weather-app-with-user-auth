import { getServerClient } from "~/server";
import type { Route } from "./+types/home";
import { data, redirect, Form } from "react-router";
import getWeatherData from "../weather/GetWeatherData";
import { tempData, timeData } from "~/weather/TestChartData";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export async function action({ request }: Route.ActionArgs) {
  const supabaseClient = getServerClient(request);

  try {
    await supabaseClient.client.auth.signOut();

    return redirect("/login", { headers: supabaseClient.headers });
  } catch (error) {
    console.error(error);
    return data(
      { error: "Failed to log out" },
      { headers: supabaseClient.headers }
    );
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const supabaseServerClient = getServerClient(request);
  const userResponse = await supabaseServerClient.client.auth.getUser();
  const user = userResponse?.data?.user;
  const userMetaData = user?.user_metadata;

  if (userResponse.error || !userResponse.data.user) {
    throw redirect("/login", { headers: supabaseServerClient.headers });
  }

  const latitude = userMetaData?.lattitude;
  const longitude = userMetaData?.longitude;

  const weatherData = await getWeatherData(latitude, longitude);

  const hourlyTime = new Array(weatherData[3]).map((dateTime) =>
    String(dateTime)
  );

  const hourlyTimeArray = hourlyTime[0].split(",").map((hour) =>
    new Date(hour).toLocaleString("en-gb", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  return data(
    {
      user: userResponse?.data?.user || null,
      userMetaData: userMetaData,
      weatherData: weatherData,
      hourlyTimeArray: hourlyTimeArray,
    },
    { headers: supabaseServerClient.headers }
  );
}

export default function home({ loaderData, actionData }: Route.ComponentProps) {
  const firstname = loaderData?.userMetaData?.firstname;
  const lastname = loaderData?.userMetaData?.lastname;
  const location = loaderData?.userMetaData?.location;
  const error = (actionData as { error: string | null })?.error;

  const [
    currentTime,
    currentTemperature,
    isItDay,
    hourlyTimeData,
    hourlyTemperatureData,
    forecastedSunriseDatetime,
    forecastedSunsetDatetime,
  ] = loaderData?.weatherData;

  return (
    <>
      <div>
        Hi {firstname} {lastname}. You're from {location}, right?
        <br />
        It's currently {isItDay ? "day" : "night"} time, hence the{" "}
        {isItDay ? "light" : "dark"} theme.
        <br />
        {location}'s current temperature: {currentTemperature} °C
      </div>
      <Form method="post">
        <button
          className="bg-white text-black m-2 p-2 rounded-md"
          type="submit"
        >
          Logout
        </button>
      </Form>
      <div></div>
    </>
  );
}
