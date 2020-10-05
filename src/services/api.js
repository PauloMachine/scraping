const axios = require("axios");

const api = axios.create({
   baseURL: '',
   timeout: 5000,
});

module.exports = api;
