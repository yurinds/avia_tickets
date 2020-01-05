import api from "../services/apiService";
import { formatDate } from "../helpers/date";
import { createUniqueToken } from "../helpers/token";
import currencyUI from "../views/currency";

class Locations {
  constructor(api, currency, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
    this.airlines = null;
    this.lastSearch = null;
    this.formatDate = helpers.formatDate;
    this.createToken = helpers.createUniqueToken;
    this.currencySymbol = currency.getCurrencySymbol.bind(currency);
  }

  async init() {
    const response = await Promise.all([
      api.countries(),
      api.cities(),
      api.airlines()
    ]);

    const [countries, cities, airlines] = response;

    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);

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
      const full_name = `${city_name}, ${country_name}`;
      acc[city.code] = { ...city, country_name, full_name };
      return acc;
    }, {});
  }

  serializeTickets({ data, currency }) {
    return Object.values(data).map(ticket => {
      return {
        ...ticket,
        currency: this.currencySymbol(currency),
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, "dd MMM yyyy hh:mm"),
        return_at: this.formatDate(ticket.return_at, "dd MMM yyyy hh:mm"),
        token: this.createToken()
      };
    });
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item;
      return acc;
    }, {});
  }

  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  getCountryNameByCode(code) {
    return this.countries[code].name;
  }
  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(
      item => item.full_name === key
    );
    return city.code;
  }

  getTicketByToken(token) {
    const ticket = this.lastSearch.find(item => item.token === token);
    return ticket;
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : "";
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : "";
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);

    this.lastSearch = this.serializeTickets(response);
  }
}

const locations = new Locations(api, currencyUI, {
  formatDate,
  createUniqueToken
});

export default locations;
