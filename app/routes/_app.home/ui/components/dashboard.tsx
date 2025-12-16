import { useEffect, useState } from "react";
import getWeatherData from "~/weatherApi/GetWeatherData";
import getGeocode from "~/weatherApi/GetGeocode";
import WeatherChart from "./hourly-temp-graph";

type DashboardProps = {
  location: string;
};

type WeatherData = {
  currentTime: Date;
  currentTemperature: string;
  isItDay: number;
  hourlyTimeData: Date[];
  hourlyTemperatureData: Float32Array | null;
  forecastedSunriseDatetime: Date[];
  forecastedSunsetDatetime: Date[];
};

export default function Dashboard({ location }: DashboardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const { lat, lng } = await getGeocode(location as string);
      const data = await getWeatherData(lat, lng);
      setWeatherData(data);
    }

    fetchWeather();
  }, [location]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const {
    currentTime,
    currentTemperature,
    isItDay,
    hourlyTimeData,
    hourlyTemperatureData,
    forecastedSunriseDatetime,
    forecastedSunsetDatetime,
  } = weatherData;

  const hourlyTime = new Array(hourlyTimeData).map((dateTime) =>
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

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="pt-8">
        It's currently {isItDay ? "day" : "night"} time in {location}. The time
        is {currentTime.toLocaleTimeString()}
        <br />
        {location}'s current temperature: {currentTemperature} °C
      </div>
      <WeatherChart
        hourlyTimeArray={hourlyTimeArray}
        hourlyTemperatureData={hourlyTemperatureData}
      />
    </div>
  );
}
