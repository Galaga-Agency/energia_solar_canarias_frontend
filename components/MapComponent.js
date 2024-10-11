import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const center = {
  lat: 27.9965,
  lng: -15.4177,
};

const MapComponent = ({ onPlaceSelected }) => {
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      setAddress(place.formatted_address);
      onPlaceSelected(location, place.formatted_address);
    }
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "";
    }
  };

  const handleMapClick = async (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(location);
    const fetchedAddress = await fetchAddressFromCoordinates(
      location.lat,
      location.lng
    );
    setAddress(fetchedAddress);
    onPlaceSelected(location, fetchedAddress);
  };

  useEffect(() => {
    setSelectedLocation(center);
    setAddress("");
  }, []);

  return (
    <>
      {window.google === undefined ? (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <MapContent
            address={address}
            setAddress={setAddress}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onPlaceSelected={onPlaceSelected}
            handlePlaceChanged={handlePlaceChanged}
            handleMapClick={handleMapClick}
            autocompleteRef={autocompleteRef}
          />
        </LoadScript>
      ) : (
        <MapContent
          address={address}
          setAddress={setAddress}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onPlaceSelected={onPlaceSelected}
          handlePlaceChanged={handlePlaceChanged}
          handleMapClick={handleMapClick}
          autocompleteRef={autocompleteRef}
        />
      )}
    </>
  );
};

const MapContent = ({
  address,
  setAddress,
  selectedLocation,
  setSelectedLocation,
  onPlaceSelected,
  handlePlaceChanged,
  handleMapClick,
  autocompleteRef,
}) => (
  <div className="p-4">
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        placeholder="Search for a location"
        className="border rounded p-2 mb-2 w-full"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </Autocomplete>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={selectedLocation}
      zoom={10}
      onClick={handleMapClick}
    >
      <Marker position={selectedLocation} />
    </GoogleMap>
  </div>
);

export default MapComponent;
