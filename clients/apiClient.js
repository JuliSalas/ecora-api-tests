const axios = require('axios');
const { baseURL } = require('../config/config');

// validateStatus: () => true hace que Axios NO lance error con 400, 401, 404, etc.
// Así podemos comprobar esos códigos como resultado esperado en las pruebas.
module.exports = axios.create({
  baseURL,
  timeout: 15000,
  validateStatus: () => true
});
