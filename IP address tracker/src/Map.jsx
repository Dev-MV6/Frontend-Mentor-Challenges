import { useEffect, useRef } from "react";
import MarkerIcon from "../public/icon-marker.png";

const Map = ({ location, infoContainerRef }) => {
  const mapRef = useRef();

  const mapContainerRef = useRef();
  const circleLayerRef = useRef();
  const markerLayerRef = useRef();

  function initMap() {
    mapRef.current = L.map(mapContainerRef.current, { zoomControl: false });
    const map = mapRef.current;
    L.control.zoom({ position: "bottomright" }).addTo(map);
    map.setView([50.503887, 4.469936], 8);

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
      {
        minZoom: 5,
        maxZoom: 13,
        attribution:
          '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | Challenge by <a href="https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0/" target="_blank">Frontend Mentor</a>. Coded by <a href="https://www.frontendmentor.io/profile/Dev-MV6">Dev-MV6</a>',
      }
    ).addTo(map);
  }

  useEffect(() => {
    if (!mapRef.current) initMap();
    const map = mapRef.current;

    if (location) {
      circleLayerRef.current?.remove();
      markerLayerRef.current?.remove();
      circleLayerRef.current = L.circle([location.lat, location.lng], {
        radius: 3000,
        fill: true,
        color: "#5f86f1",
        opacity: 0.7,
        fillOpacity: 0.15,
      }).addTo(map);

      markerLayerRef.current = L.marker([location.lat, location.lng], {
        icon: L.icon({
          iconUrl: MarkerIcon,
          iconSize: [20, 35],
          iconAnchor: [10, 35], // point of the icon which will correspond to marker's location
        }),
      }).addTo(map);

      // Calculate offset
      const mapContainerRec = mapContainerRef.current.getBoundingClientRect();
      const infoContainerRec = infoContainerRef.current.getBoundingClientRect();
      const offsetY = infoContainerRec.bottom - mapContainerRec.top;

      const mapZoom = mapContainerRec.height - offsetY > 400 ? 13 : 12; // Zoom fix for smaller screens
      map.setView([location.lat, location.lng], mapZoom, { animate: false }).panBy([0, -offsetY / 2], { animate: false });
    }
  }, [location]);

  return <div className="w-full flex-grow" ref={mapContainerRef}></div>;
};

export default Map;
