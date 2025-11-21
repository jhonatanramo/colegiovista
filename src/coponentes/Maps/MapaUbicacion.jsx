import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const MapaUbicacion = ({ seturl }) => {
  const [ubicacion, setUbicacion] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDROV7Q2awH92CRumj3WD31iUd4HrNh4Ow"
  });

  // Función para generar el enlace de Google Maps
  const generarUrlGoogleMaps = (lat, lng) => 
    `https://maps.app.goo.gl/?link=https://www.google.com/maps?q=${lat},${lng}`;

  // Obtener ubicación del dispositivo al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUbicacion(coords);
          seturl(generarUrlGoogleMaps(coords.lat, coords.lng));
        },
        (err) => console.error("Error al obtener ubicación:", err)
      );
    }
  }, [seturl]);

  // Actualizar ubicación al hacer click en el mapa
  const handleMapaClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setUbicacion(coords);
    seturl(generarUrlGoogleMaps(coords.lat, coords.lng));
  };

  return (
    <div>
      {isLoaded && ubicacion ? (
        <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={ubicacion}
            zoom={15}
            onClick={handleMapaClick}
          >
            <Marker position={ubicacion} />
          </GoogleMap>
          <div style={{ marginTop: "10px" }}>
            <p>
              <strong>Enlace de ubicación:</strong>{" "}
              <a href={generarUrlGoogleMaps(ubicacion.lat, ubicacion.lng)} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </p>
          </div>
        </>
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
};

export default React.memo(MapaUbicacion);
