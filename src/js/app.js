import locations from "./store/locations";

locations.init().then(res => {
  console.log(locations.getCitiesByCountryCode("ES"));
});
