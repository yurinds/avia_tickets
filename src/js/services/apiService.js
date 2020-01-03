import axios from "axios";
import config from "../config/apiConfig";

class Api {
  constructor(config) {
    this.url = config.url;
  }

  async countries() {
    try {
      const response = await axios.get(`${this.url}/countries`);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async cities() {
    try {
      const response = await axios.get(`${this.url}/cities`);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const api = new Api(config);

export default api;
