export default async function getGeocode(city: string) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsApiKey}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const result = data.results[0];
      console.log("Geocode:", result.geometry.location);
      const location = result.geometry.location;
      return location;
    } else {
      console.log("Invalid city or API error. Status:", data.status);
      return data.status;
    }
  } catch (error) {
    console.log(error);
  }
}
