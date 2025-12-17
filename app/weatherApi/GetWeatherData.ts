import { fetchWeatherApi } from "openmeteo";

export default async function getWeatherData(
  latitude: number,
  longitude: number
) {
  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: ["sunrise", "sunset"],
    hourly: "temperature_2m",
    current: ["temperature_2m", "is_day"],
    timezone: "Europe/London",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;
  const utcOffsetSeconds = response.utcOffsetSeconds()!;

  const sunrise = daily.variables(0)!;
  const sunset = daily.variables(1)!;

  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      is_day: current.variables(1)!.value(),
    },
    hourly: {
      time: Array.from(
        {
          length:
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        },
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
    },
    daily: {
      time: Array.from(
        {
          length:
            (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
        },
        (_, i) =>
          new Date(
            (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      sunrise: [...Array(sunrise.valuesInt64Length())].map(
        (_, i) =>
          new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      sunset: [...Array(sunset.valuesInt64Length())].map(
        (_, i) =>
          new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
    },
  };

  const currentTime = weatherData.current.time;
  const currentTemperature = weatherData.current.temperature_2m.toFixed(2);
  const isItDay = weatherData.current.is_day;
  const hourlyTimeData = weatherData.hourly.time;
  const hourlyTemperatureData = weatherData.hourly.temperature_2m;
  const forecastedSunriseDatetime = weatherData.daily.sunrise;
  const forecastedSunsetDatetime = weatherData.daily.sunset;

  return {
    currentTime,
    currentTemperature,
    isItDay,
    hourlyTimeData,
    hourlyTemperatureData,
    forecastedSunriseDatetime,
    forecastedSunsetDatetime,
  };
}
