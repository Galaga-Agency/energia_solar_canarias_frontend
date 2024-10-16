import { useState } from "react";
import axios from "axios";

const useGeocode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const geocodeAddress = async (address) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      setLoading(false);
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return location;
      } else {
        setError("Address not found");
        return null;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Error geocoding address");
      setLoading(false);
      return null;
    }
  };

  return { geocodeAddress, loading, error };
};

export default useGeocode;
