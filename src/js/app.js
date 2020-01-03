import api from "./services/apiService";

api
  .countries()
  .then(res => console.log(res))
  .catch(err => console.log(err));

api
  .cities()
  .then(res => console.log(res))
  .catch(err => console.log(err));
