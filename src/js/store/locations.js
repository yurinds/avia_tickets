import api from "../services/apiService";
import { isThisSecond } from "date-fns";

class Locations {
  constructor(api) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
  }

  async init() {
    const response = await Promise.all([api.countries(), api.cities()]);

    const [countries, cities] = response;

    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);

    return response;
  }

  serializeCountries(countries) {
    // { 'Country code' : {...} }
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  serializeCities(cities) {
    // { 'Citi name, Country name' : {...} }
    return cities.reduce((acc, city) => {
      const city_name = city.name || city.name_translations.en;
      const country_name = this.getCountryNameByCode(city.country_code);
      const key = `${city_name}, ${country_name}`;
      acc[key] = city;
      return acc;
    }, {});
  }

  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [key]) => {
      acc[key] = null;
      return acc;
    }, {});
  }

  getCountryNameByCode(code) {
    return this.countries[code].name;
  }

  getCityCodeByKey(key) {
    return this.cities[key].code;
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);

    console.log(response);
  }
}

const locations = new Locations(api);

export default locations;
