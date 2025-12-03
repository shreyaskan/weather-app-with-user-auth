import getWeatherData from "../../../../weather/GetWeatherData";

export default async function Dashboard({
  location,
  latitude,
  longitude,
}: {
  location: String;
  latitude: number;
  longitude: number;
}) {
  async function getCurrentWeatherData(latitude: number, longitude: number) {
    const currentWeatherData = await getWeatherData(latitude, longitude);
    return currentWeatherData;
  }

  const selectedLocationWeather = await getCurrentWeatherData(
    latitude,
    longitude
  );

  const hourlyTime = new Array(selectedLocationWeather[3]).map((dateTime) =>
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

  const [
    currentTime,
    currentTemperature,
    isItDay,
    hourlyTimeData,
    hourlyTemperatureData,
    forecastedSunriseDatetime,
    forecastedSunsetDatetime,
  ] = selectedLocationWeather;

  return (
    <div>
      It's currently {isItDay ? "day" : "night"} time, hence the{" "}
      {isItDay ? "light" : "dark"} theme.
      <br />
      {location}'s current temperature: {String(currentTemperature)} °C
    </div>
  );
}
