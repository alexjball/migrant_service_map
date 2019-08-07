import iconColors from "../../assets/icon-colors";

const scrollToCard = clickedProviderID => {
  const offsetTop = document.getElementById(clickedProviderID).offsetTop;
  const cardOffset = 50;

  const panel = document.getElementsByClassName("panels")[0];
  const toScrollTo = offsetTop - cardOffset;
  const steps = 15;
  const scrollStep = (toScrollTo - panel.scrollTop) / steps;
  let stepCount = 0;

  const scrollInterval = setInterval(function() {
    if (stepCount < steps) {
      panel.scrollBy(0, scrollStep);
      stepCount++;
    } else {
      panel.scrollTop = toScrollTo;
      clearInterval(scrollInterval);
    }
  }, 15);
};

const convertProvidersToGeoJSON = providers => {
  return providers.map(provider => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: provider.coordinates
    },
    properties: provider
  }));
};

const createCenterMarker = () => {
  const centerMarker = document.createElement("div");
  const mapPin = document.createElement("div");
  const pinHole = document.createElement("div");
  mapPin.className = "map-pin";
  pinHole.className = "pin-hole";
  centerMarker.className = "map-pin-container";
  centerMarker.appendChild(mapPin);
  centerMarker.appendChild(pinHole);
  return centerMarker;
};

const createDistanceMarker = (distance, color) => {
  const markerElement = document.createElement("div");
  markerElement.className = "distance-marker";
  markerElement.id = "marker-" + distance + "-miles";
  markerElement.innerText = distance + (distance > 1 ? " miles" : " mile");
  markerElement.style.backgroundColor = color;
  return markerElement;
};

const markerStyle = {
  color: ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"],
  options: { steps: 100, units: "miles" }
};

const removeDistanceMarkers = markerArray => {
  // const distanceMarkers = Array.from(document.getElementsByClassName("distanceMarker"));
  return markerArray.map(marker => marker.remove());
};

const normalizeProviders = providerFeatures => {
  const providerTypes = { byId: {}, allIds: [] };
  const providers = { byId: {}, allIds: [] };
  Array.from(providerFeatures).map(
    ({ id, geometry: { coordinates }, properties }, index) => {
      let formattedTypeId = properties["Type of Service"]
        .toLowerCase()
        .split(" ")
        .join("-");
      id = index;
      const typeExists = providerTypes.allIds.includes(formattedTypeId);
      if (formattedTypeId === "community-center") {
        // special case
        formattedTypeId = "community-centers";
      }
      if (typeExists) {
        providerTypes.byId[formattedTypeId] = {
          ...providerTypes.byId[formattedTypeId],
          id: formattedTypeId,
          name: properties["Type of Service"],
          providers: [...providerTypes.byId[formattedTypeId].providers, id]
        };
      } else {
        if (!providerTypes.allIds.includes(formattedTypeId)) {
          providerTypes.allIds.push(formattedTypeId);
        }
        providerTypes.byId[formattedTypeId] = {
          id: formattedTypeId,
          name: properties["Type of Service"],
          providers: [id]
        };
      }

      return (providers.byId[id] = {
        id,
        coordinates,
        address:
          properties[
            "Address (#, Street Name, District/city, State, Zip Code)"
          ],
        email: properties["Email:"],
        mission: properties["Mission:"],
        name: properties["Organization Name"],
        telephone: properties["Telephone:"],
        timestamp: properties.Timestamp,
        // Type of Service
        typeName: properties["Type of Service"], // synonym for next line
        typeId: formattedTypeId,
        "Type of Service": properties["Type of Service"], // as referenced in reducer helper function
        // Validated By
        website: properties.Website,
        color: iconColors.formattedTypeId
      });
    }
  );
  // sorted by name
  providerTypes.allIds.map(id => {
    const providersByType = providerTypes.byId[id].providers;
    return providersByType.sort((a, b) =>
      providers.byId[a].name.localeCompare(providers.byId[b].name)
    );
  });
  // commit map query result to redux
  return { providerTypes, providers };
};

const getBoundingBox = (providers, providerIds) => {
  let lngs = [],
    lats = [];
  providerIds.forEach(id => {
    const { coordinates } = providers.byId[id];
    if (coordinates.length > 0) {
      lngs.push(coordinates[0]);
      lats.push(coordinates[1]);
    }
  });

  const maxLngs = lngs.reduce((a, b) => Math.max(a, b));
  const minLngs = lngs.reduce((a, b) => Math.min(a, b));
  const maxLats = lats.reduce((a, b) => Math.max(a, b));
  const minLats = lats.reduce((a, b) => Math.min(a, b));

  console.log("blah", [[minLngs, minLats], [maxLngs, maxLats]])

  return [[minLngs, minLats], [maxLngs, maxLats]];
};

export {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  markerStyle,
  normalizeProviders,
  removeDistanceMarkers,
  scrollToCard,
  getBoundingBox
};
