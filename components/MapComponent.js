import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const center = {
  lat: -3.745, // Default latitude
  lng: -38.523, // Default longitude
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
      onPlaceSelected(location, place.formatted_address); // Pass selected location and address back to parent
    }
  };

  // Reset the map state when the modal opens
  useEffect(() => {
    setSelectedLocation(center); // Reset to default center
    setAddress(""); // Clear the address
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
      onClick={(event) => {
        setSelectedLocation({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
        setAddress(""); // Clear address when clicked on map
      }}
    >
      <Marker position={selectedLocation} />
    </GoogleMap>
  </div>
);

export default MapComponent;
